const db = require("../models");
const { sequelize } = db;
const { Op, fn, col, where } = require("sequelize");
const { emptyToNull } = require("../utils/empty-to-null");

exports.warn = async (req, res) => {
  try {
    const userid = req.user.userid;
    const doctorid = req.user.doctorid;

    const fields = ["creator", "viewer", "staff_id", "nurse_id"];

    const orConditions = fields.map((f) => ({
      [f]: userid,
    }));

    if (doctorid) {
      orConditions.push({ doctor_id: doctorid });
    }

    const forms = await db.Form.findAll({
      where: {
        [Op.or]: orConditions,
        form_status: "pending",
      },
    });

    let needSign = [];

    // 🔥 loop ทีละ form
    for (const form of forms) {
      const [staff_sign, nurse_sign, doctor_sign] = await Promise.all([
        db.StaffSign.findOne({ where: { form_id: form.id } }),
        db.NurseSign.findOne({ where: { form_id: form.id } }),
        db.DoctorSign.findOne({ where: { form_id: form.id } }),
      ]);

      // 🔥 เช็คว่า user ต้องเซ็นไหม
      if (form.staff_id === userid && !staff_sign) {
        needSign.push({ form_id: form.id, role: "staff" });
        continue;
      }

      if (form.nurse_id === userid && !nurse_sign) {
        needSign.push({ form_id: form.id, role: "nurse" });
        continue;
      }

      if (doctorid && form.doctor_id === doctorid && !doctor_sign) {
        needSign.push({ form_id: form.id, role: "doctor" });
        continue;
      }
    }

    return res.json({
      count: needSign.length,
      data: needSign,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
