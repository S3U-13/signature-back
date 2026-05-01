const db = require("../models");
const { sequelize } = db;
const { Op, fn, col } = require("sequelize");
const dashboardService = require("../services/dashboard.service");
const { calcPercent } = require("../utils/calcPercent");

exports.dashboard = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // ช่วงปีปัจจุบัน
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    const [
      system_overview,
      pending_overview,
      save_overview,
      success_overview,
      cancel_overview,
      monthly_overview_raw,
      last2MonthsRaw,
    ] = await Promise.all([
      db.Form.count({ where: { flag_status: "a" } }),
      db.Form.count({ where: { form_status: "Pending", flag_status: "a" } }),
      db.Form.count({ where: { form_status: "Saved", flag_status: "a" } }),
      db.Form.count({ where: { form_status: "Success", flag_status: "a" } }),
      db.Form.count({ where: { flag_status: "c" } }),
      // 👉 monthly
      dashboardService.monthlyQuery(), // 👈 service
      dashboardService.getLast2MonthsStats(), // 👈 service
    ]);

    // 🔥 map เดือน (1-12)
    const monthlyMap = {};

    monthly_overview_raw.forEach((item) => {
      const monthIndex = Number(item.month.split("-")[1]) - 1;

      monthlyMap[monthIndex] = {
        month: monthIndex + 1,
        total: Number(item.total),
        success_total: Number(item.success_total || 0),
      };
    });

    // 🔥 เติมเดือนที่ไม่มีข้อมูล
    const monthly_overview = Array.from({ length: 12 }, (_, i) => {
      return (
        monthlyMap[i] || {
          month: i + 1,
          total: 0,
          success_total: 0,
        }
      );
    });

    const buddhistYear = currentYear + 543;

    const current = last2MonthsRaw[last2MonthsRaw.length - 1] || {};
    const previous = last2MonthsRaw[last2MonthsRaw.length - 2] || {};

    // object

    const overview = {
      system_overview,
      pending_overview,
      save_overview,
      success_overview,
      cancel_overview,
    };

    const percent = {
      system_overview: calcPercent(current.total, previous.total),
      pending_overview: calcPercent(current.pending, previous.pending),
      save_overview: calcPercent(current.saved, previous.saved),
      success_overview: calcPercent(current.success, previous.success),
      cancel_overview: calcPercent(current.cancel, previous.cancel),
    };

    return res.status(200).json({
      message: "success",
      year: buddhistYear,
      overview,
      monthly_overview,
      percent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.latestMovement = async (req, res) => {
  try {
    // หาฟอร์มล่าสุด
    const last_form = await db.Form.findOne({
      attributes: ["id", "form_type_id", "creator", "viewer"],
      where: { flag_status: "a" },
      order: [["createdAt", "DESC"]],
    });

    // หา action form ล่าสด
    const form_action = await db.FormAction.findAll({
      where: { form_id: last_form?.id },
    });

    // หา person จาก user ถ้า role เป็น staff/nurse

    const mapUserAction = form_action
      .filter((i) => ["staff", "nurse"].includes(i.role))
      .map((u) => u.userid);

    const users = [
      ...new Set([last_form.creator, last_form.viewer, ...mapUserAction]),
    ];

    // 🔥 ยิง query ทีเดียว
    const usersData = await db.AppUser.findAll({
      attributes: ["userid", "personid"],
      where: { userid: users },
      raw: true,
    });

    // 🔥 map เป็น object
    const mapUserToPersonID = Object.fromEntries(
      usersData.map((u) => [u.userid, u.personid]),
    );

    // 🔹 example ใช้งาน
    const creatorPerson = mapUserToPersonID[last_form.creator];
    const viewerPerson = mapUserToPersonID[last_form.viewer];

    const personIds = Object.values(mapUserToPersonID).filter(Boolean);

    const uniquePersonIds = [...new Set(personIds)];

    const persons = await db.AppPerson.findAll({
      where: {
        id: uniquePersonIds,
      },
      include: [
        {
          model: db.Lookup,
          as: "Salutation",
          where: { lookuptypeid: 17 },
          required: false,
        },
      ],
    });

    const mapPerson = Object.fromEntries(
      persons.map((p) => [
        p.id,
        `${p.Salutation.lookupname || ""}${p.firstname} ${p.lastname}`,
      ]),
    );
    // console.log(persons);

    console.log(mapPerson);

    // หา doctor name จาก doctor user

    const mapUserDoctorAction = form_action
      .filter((i) => i.role === "doctor")
      .map((u) => u.doctorid);

    // const doctor;

    return res.status(200).json({
      form_action,
      mapUserToPersonID,
      creatorPerson,
      viewerPerson,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
