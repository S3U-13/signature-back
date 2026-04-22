const db = require("../models");
const { sequelize } = db;
const { Op, Model } = require("sequelize");
const { emptyToNull } = require("../utils/empty-to-null");
const { signBuffers } = require("../utils/signatureInputHelper");
const { checkAndUpdateFormStatus } = require("./checkAndUpdateFormStatus");

exports.brachytherapyConsentFormService = async (id, body, user) => {
  const t = await sequelize.transaction();

  try {
    const role = user?.role;
    // function เเปลงค่าว่างเป็น null
    const cleanedBody = emptyToNull(body);
    // ประกาศ field รับค่า req
    const {
      hn,
      disease,
      lmp,
      consent,
      name,
      relation,
      patient_sign,
      patient_sign_date,
      witness_name,
      witness_sign,
      witness_sign_date,
      staff_posid,
      staff_sign_id,
      staff_sign_date,
      nurse_sign_id,
      nurse_sign_date,
      doctor_sign_id,
      doctor_sign_date,
    } = cleanedBody;

    // ประกาศ field สำคัญ ที่ req ต้อง การ
    const requiredFields = ["hn"];
    for (const field of requiredFields) {
      if (!cleanedBody[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // create data to db
    await db.Form.update(
      {
        disease,
        lmp,
        consent,
        form_status: "Saved",
      },
      { where: { id: id }, transaction: t },
    );

    const [
      patient_contact_existing,
      pat_sign_existing,
      witness_sign_existing,
      staff_sign_existing,
      nurse_sign_existing,
      doctor_sign_existing,
    ] = await Promise.all([
      db.PatientContacts.findOne({ where: { form_id: id } }),
      db.PatSign.findOne({ where: { form_id: id } }),
      db.WitnessSign.findOne({ where: { form_id: id } }),
      db.StaffSign.findOne({ where: { form_id: id } }),
      db.NurseSign.findOne({ where: { form_id: id } }),
      db.DoctorSign.findOne({ where: { form_id: id }, transaction: t }),
    ]);

    const buffers = signBuffers({
      patient_sign,
      witness_sign,
    });

    if (patient_contact_existing) {
      await db.PatientContacts.update(
        {
          name,
          relation,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.PatientContacts.create(
        {
          form_id: id,
          name,
          relation,
        },
        { transaction: t },
      );
    }

    if (pat_sign_existing) {
      await db.PatSign.update(
        {
          hn: hn,
          patient_sign: buffers.patient_sign,
          patient_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.PatSign.create(
        {
          form_id: id,
          hn: hn,
          patient_sign: buffers.patient_sign,
          patient_sign_date,
        },
        { transaction: t },
      );
    }

    if (witness_sign_existing) {
      await db.WitnessSign.update(
        {
          witness_name,
          witness_sign: buffers.witness_sign,
          witness_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.WitnessSign.create(
        {
          form_id: id,
          witness_name,
          witness_sign: buffers.witness_sign,
          witness_sign_date,
        },
        { transaction: t },
      );
    }

    if (role === "staff") {
      if (staff_sign_existing) {
        await db.StaffSign.update(
          {
            staff_id: user.userid,
            staff_position: staff_posid,
            signature_id: staff_sign_id,
            staff_sign_date,
          },
          { where: { form_id: id }, transaction: t },
        );
      } else {
        await db.StaffSign.create(
          {
            form_id: id,
            staff_id: user.userid,
            staff_position: staff_posid,
            signature_id: staff_sign_id,
            staff_sign_date,
          },
          { transaction: t },
        );
      }
    }

    if (role === "nurse") {
      if (nurse_sign_existing) {
        await db.NurseSign.update(
          {
            nurse_id: user.userid,
            signature_id: nurse_sign_id,
            nurse_sign_date,
          },
          { where: { form_id: id }, transaction: t },
        );
      } else {
        await db.NurseSign.create(
          {
            form_id: id,
            nurse_id: user.userid,
            signature_id: nurse_sign_id,
            nurse_sign_date,
          },
          { transaction: t },
        );
      }
    }
    if (role === "doctor") {
      if (doctor_sign_existing) {
        await db.DoctorSign.update(
          {
            doctor_id: user.doctorid,
            signature_id: doctor_sign_id,
            doctor_sign_date,
          },
          { where: { form_id: id }, transaction: t },
        );
      } else {
        await db.DoctorSign.create(
          {
            form_id: id,
            doctor_id: user.doctorid,
            signature_id: doctor_sign_id,
            doctor_sign_date,
          },
          { transaction: t },
        );
      }
    }
    // -------------------------
    // FormAction update
    // -------------------------
    const statusMap = {
      staff: staff_sign_id,
      nurse: nurse_sign_id,
      doctor: doctor_sign_id,
    };

    const status = statusMap[role] ? "signed" : "unsigned";

    const where = {
      form_id: id,
      userid: user?.userid,
      ...(role === "doctor" && { doctorid: user.doctorid }),
    };

    const [updated] = await db.FormAction.update(
      {
        status,
        signed_at: new Date(),
      },
      { where, transaction: t },
    );

    if (updated === 0) {
      throw new Error("FormAction not found to update");
    }

    // ✅🔥 แก้ตรงนี้
    await checkAndUpdateFormStatus(id, t);

    await t.commit();

    const isSigning = status === "signed";

    // 🔥 หา target คนอื่นในฟอร์มนี้
    const actions = await db.FormAction.findAll({
      where: { form_id: id },
    });

    const targets = actions
      .map((a) => a.userid)
      .filter((uid) => uid && uid !== user.userid); // ❗ไม่ยิงให้ตัวเอง

    targets.forEach((uid) => {
      if (isSigning) {
        // ✍️ มีการเซ็น
        global.io.to(`user_${uid}`).emit("form-progress", {
          form_id: id,
          message: "มีการเซ็นเอกสารแล้ว",
        });
      } else {
        // 💾 แค่ save
        global.io.to(`user_${uid}`).emit("form-saved", {
          form_id: id,
          message: "มีการบันทึกข้อมูลในเอกสาร",
        });
      }
    });

    return true;
  } catch (error) {
    await t.rollback();

    throw error;
  }
};
