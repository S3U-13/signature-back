const db = require("../models");
const { sequelize } = db;
// const { logAction } = require("../services/logService");

exports.user_ppk = async (req, res) => {
  const { userid } = req.params;
  try {
    const app_user = await db.AppUser.findOne({
      where: { userid: userid },
    });

    if (!app_user) {
      return res.status(404).json({ message: "ไม่เจอ app_user" });
    }

    const app_person = await db.AppPerson.findOne({
      where: { id: app_user.personid },
      include: [
        { model: db.Lookup, as: "Salutation", where: { lookuptypeid: 17 } },
        { model: db.AppGroup, as: "Group" },
        { model: db.AppPosition, as: "Position" },
        { model: db.PersonalOfficeGroup, as: "Office" },
        { model: db.AppPersonFunctionalUnit, as: "Funcunit" },
      ],
    });

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
          },
          {
            model: db.DoctorFlag,
            as: "Level",
            where: { columnname: "doctorlevel" },
          },
        ],
      });
      role = "doctor";
    } else {
      role = "staff";
    }

    const name = doctor_data
      ? `${doctor_data?.doctorsalutation}${doctor_data?.doctorname} ${doctor_data?.doctorlastname}`
      : `${app_person?.Salutation?.lookupname}${app_person?.firstname} ${app_person?.lastname}`;

    const sex_doctor = doctor_data?.sex === "F" ? "หญิง" : "ชาย";

    const specialist = doctor_data ? doctor_data?.Specialist.descvalue : "";
    const level = doctor_data ? doctor_data?.Level.descvalue : "";
    const doctor_license = doctor_data ? doctor_data?.doctorlicenseid : "";

    const sex = doctor_data ? sex_doctor : app_person?.Sex;

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
      role,
      specialist,
      level,
      birthday: app_person?.Birthday ?? null,
    };

    return res.status(200).json({ user_data });
  } catch (error) {
    console.log(error); // 👈 สำคัญ
    return res.status(500).json({ message: error.message });
  }
};
