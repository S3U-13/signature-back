const db = require("../models");
const { sequelize } = db;
const { Op } = require("sequelize");
// const { logAction } = require("../services/logService");

exports.doctors_by_group_radio_therapy = async (req, res) => {
  try {
    const doctors = await db.DoctorLocation.findAll({
      where: {
        locationid: [3020, 3021, 3025, 3026, 3027],
        doctorid: {
          [Op.notIn]: [89],
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: db.DoctorName,
          as: "Doctor",
          attributes: [
            "doctorid",
            "doctorname",
            "doctorlastname",
            "doctorsalutation",
            "flag_active",
          ],
          where: { flag_active: "Y" },
        },
        { model: db.Location, as: "LocationDoctor" },
        { model: db.DoctorUser, as: "DoctorUserByDoctorLocation" },
      ],
    });

    const doctorFormatted = doctors.map((doctors) => {
      return {
        userid: doctors.DoctorUserByDoctorLocation?.userid ?? null,
        doctorid: doctors.doctorid,
        name: `${doctors.Doctor.doctorsalutation}${doctors.Doctor.doctorname} ${doctors.Doctor.doctorlastname}`,
        location: doctors.locationid,
        location_name: doctors.LocationDoctor.detailtext,
      };
    });

    return res.status(200).json({ doctorFormatted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.user_ppk_group_by_radio_therapy = async (req, res) => {
  try {
    // 🔥 1. เอา doctor ทั้งหมด
    const doctor_users = await db.DoctorUser.findAll({
      attributes: ["userid"],
    });
    const doctorIds = doctor_users.map((d) => d.userid);

    // 🔥 2. เอา user_groups (ตัดหมอออกตั้งแต่ DB)
    const user_groups = await db.AppDataGroup.findAll({
      where: {
        groupid: [27, 99, 150, 370, 380],
        active: "Y",
        userid: {
          [Op.notIn]: doctorIds,
        },
      },
    });

    // 🔥 3. ดึง AppUser ทีเดียว
    const userIds = user_groups.map((g) => g.userid);

    const app_users = await db.AppUser.findAll({
      attributes: ["userid", "personid", "active"],
      where: {
        userid: userIds,
        active: "Y",
        personid: {
          [Op.ne]: null, // ✅ เอาเฉพาะที่มี personid
        },
      },
    });

    // map user -> personid
    const userMap = {};
    app_users.forEach((u) => {
      userMap[u.userid] = u.personid;
    });

    // 🔥 4. ดึง person ทีเดียว
    const personIds = app_users.map((u) => u.personid);

    const persons = await db.AppPerson.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "FuncUnitID",
        "StatusID",
        "Remark",
      ],
      where: {
        id: personIds,
        FuncUnitID: {
          [Op.notIn]: [12, 260, 276, 277],
        },
        StatusID: 1,
        Remark: "user",
      },
      include: [
        { model: db.Lookup, as: "Salutation", where: { lookuptypeid: 17 } },
      ],
    });

    // map person
    const personMap = {};
    persons.forEach((p) => {
      personMap[p.id] =
        `${p.Salutation.lookupname}${p.firstname} ${p.lastname}`;
    });

    // 🔥 5. ดึง set_group ทีเดียว (ไม่ loop)
    const set_groups = await db.AppDataSetGroup.findAll({
      where: {
        groupid: [27, 99, 150, 370, 380],
        rightflag: "Y",
        referencename: "LOCATION_NURSE",
      },
      order: [["referenceid", "ASC"]],
    });

    // 🔥 6. รวมข้อมูล
    const results = user_groups.flatMap((user) => {
      const personid = userMap[user.userid];

      // ❌ ไม่มี personid
      if (!personid) return [];

      // ❌ ไม่ใช่ Remark = user
      if (!personMap[personid]) return [];

      return set_groups.map((sg) => ({
        userid: user.userid,
        person_name: personMap[userMap[user.userid]] || "",
        groupid: sg.groupid,
        referenceid: sg.referenceid,
      }));
    });

    // 🔥 7. group by userid
    const grouped = Object.values(
      results.reduce((acc, item) => {
        const personid = userMap[item.userid];

        // ❌ ถ้าไม่มี personid → ไม่เอา
        if (!personid) return acc;

        if (!acc[item.userid]) {
          acc[item.userid] = {
            userid: item.userid, // ✅ ใช้ตัวนี้
            personid: personid, // ✅ อ้างจาก userMap
            person_name: personMap[personid] || "",
            groupid: item.groupid,
            referenceids: [],
          };
        }

        acc[item.userid].referenceids.push(item.referenceid);
        return acc;
      }, {}),
    );

    return res.status(200).json({ grouped });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.user_ppk = async (req, res) => {
  const { userid } = req.params;
  const userIds = userid.split(",").map((id) => id.trim());

  try {
    const app_users = await db.AppUser.findAll({
      where: {
        userid: {
          [Op.in]: userIds,
        },
      },
    });

    if (!app_users.length) {
      return res.status(404).json({ message: "ไม่เจอ app_user" });
    }

    const results = [];

    for (const app_user of app_users) {
      const app_person = await db.AppPerson.findOne({
        where: { id: app_user.personid },
        include: [
          {
            model: db.Lookup,
            as: "Salutation",
            where: { lookuptypeid: 17 },
            required: false,
          },
          { model: db.AppGroup, as: "Group", required: false },
          { model: db.AppPosition, as: "Position", required: false },
          { model: db.PersonalOfficeGroup, as: "Office", required: false },
          {
            model: db.AppPersonFunctionalUnit,
            as: "Funcunit",
            required: false,
          },
        ],
      });

      if (!app_person) continue;

      let doctor_data = null;
      let role = null;

      if ([61502, 61523, 61525].includes(app_person?.PosID)) {
        role = "nurse";
      } else if ([60104, 60204, 60501, 82923].includes(app_person?.PosID)) {
        doctor_data = await db.DoctorName.findOne({
          where: { personid: app_person.id },
          include: [
            {
              model: db.DoctorFlag,
              as: "Specialist",
              where: { columnname: "doctorspecialist" },
              required: false,
            },
            {
              model: db.DoctorFlag,
              as: "Level",
              where: { columnname: "doctorlevel" },
              required: false,
            },
          ],
        });
        role = "doctor";
      } else {
        role = "staff";
      }

      const name = doctor_data
        ? `${doctor_data?.doctorsalutation ?? ""}${doctor_data?.doctorname ?? ""} ${doctor_data?.doctorlastname ?? ""}`
        : `${app_person?.Salutation?.lookupname ?? ""}${app_person?.firstname ?? ""} ${app_person?.lastname ?? ""}`;

      const sex_doctor = doctor_data?.sex === "F" ? "หญิง" : "ชาย";

      const user_data = {
        userid: app_user.userid,
        firstname_lastname: `${app_person?.firstname ?? ""} ${app_person?.lastname ?? ""}`,
        person_name: name,
        sex: doctor_data ? sex_doctor : (app_person?.Sex ?? null),
        doctor_license: doctor_data?.doctorlicenseid ?? "",
        GroID: app_person?.GroID ?? null,
        group: app_person?.Group?.groupname ?? null,
        PosID: app_person?.PosID ?? null,
        position: app_person?.Position?.Positionname ?? null,
        OffID: app_person?.OffID ?? null,
        office: app_person?.Office?.offname ?? null,
        FuncunitID: app_person?.FuncUnitID ?? null,
        func_unit: app_person?.Funcunit?.FuncunitName ?? null,
        role,
        specialist: doctor_data?.Specialist?.descvalue ?? "",
        level: doctor_data?.Level?.descvalue ?? "",
        birthday: app_person?.Birthday ?? null,
      };

      results.push(user_data);
    }

    return res.status(200).json({ user_data: results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.doctor_ppk = async (req, res) => {
  const { doctorid } = req.params;
  try {
    const [doctor_user, doctor_name] = await Promise.all([
      db.DoctorUser.findOne({ where: { doctorid: doctorid } }),
      db.DoctorName.findOne({
        where: { doctorid: doctorid },
        include: [
          {
            model: db.DoctorFlag,
            as: "Specialist",
            where: { columnname: "doctorspecialist" },
          },
          {
            model: db.DoctorFlag,
            as: "Level",
            where: { columnname: "doctorlevel" },
          },
        ],
      }),
    ]);

    const user = await db.AppUser.findOne({
      where: { userid: doctor_user.userid },
    });
    const app_person = await db.AppPerson.findOne({
      where: { id: user.personid },
      include: [
        { model: db.Lookup, as: "Salutation", where: { lookuptypeid: 17 } },
        { model: db.AppGroup, as: "Group" },
        { model: db.AppPosition, as: "Position" },
        { model: db.PersonalOfficeGroup, as: "Office" },
        { model: db.AppPersonFunctionalUnit, as: "Funcunit" },
      ],
    });

    const name =
      `${doctor_name?.doctorsalutation}${doctor_name?.doctorname} ${doctor_name?.doctorlastname}` ??
      null;

    const sex = doctor_name?.sex === "F" ? "หญิง" : "ชาย";

    const specialist = doctor_name ? doctor_name?.Specialist.descvalue : "";
    const level = doctor_name ? doctor_name?.Level.descvalue : "";
    const doctor_license = doctor_name ? doctor_name?.doctorlicenseid : "";

    const user_data = {
      person_name: name,
      sex,
      doctor_license,
      GroID: app_person?.GroID ?? null,
      group: app_person?.Group?.groupname ?? null,
      PosID: app_person?.PosID ?? null,
      position: app_person?.Position?.Positionname ?? null,
      OffID: app_person?.OffID ?? null,
      office: app_person?.Office?.offname ?? null,
      FuncunitID: app_person?.FuncUnitID ?? null,
      func_unit: app_person?.Funcunit?.FuncunitName ?? null,
      specialist,
      level,
      birthday: app_person?.Birthday ?? null,
    };
    return res.status(200).json({ user_data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.get_user = async (req, res) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const app_user = await db.AppUser.findAll({ where: { active: "Y" } });
    const userMap = [];

    for (const u of app_user) {
      if (!u.personid) continue;

      const person = await db.AppPerson.findOne({
        attributes: [
          "id",
          "salutation",
          "firstname",
          "lastname",
          "sex",
          "CITIZEN",
          "Remark",
          "PosID",
          "OffID",
        ],
        where: {
          id: u.personid,
          StatusID: 1,
          Remark: "user",
          PosID: { [Op.notIn]: [60104, 60204, 60501, 82923] },
        },
        include: [
          {
            model: db.Lookup,
            as: "Salutation",
            where: { lookuptypeid: 17 },
          },
          { model: db.AppPosition, as: "Position" },
          { model: db.PersonalOfficeGroup, as: "Office" },
        ],
      });

      if (!person) continue;

      const fullName = `${person?.Salutation?.lookupname || ""}${
        person.firstname || ""
      } ${person.lastname || ""}`;

      const citizen = person?.CITIZEN || "";

      const positon = person?.Position?.Positionname || "";

      const keyword = search?.toLowerCase();

      if (
        keyword &&
        !fullName.toLowerCase().includes(keyword) &&
        !citizen.includes(keyword) &&
        !positon.includes(keyword)
      ) {
        continue;
      }

      userMap.push({
        userid: u.userid,
        personid: u.personid,
        name: fullName,
        sex: person.sex,
        position: person.Position?.Positionname || "",
        office: person.Office?.offname || "",
        citizen,
      });
    }

    const total = userMap.length;

    const paginatedUsers = userMap.slice(offset, offset + limit);

    return res.status(200).json({
      users: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        from: total === 0 ? 0 : offset + 1,
        to: Math.min(offset + limit, total),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
