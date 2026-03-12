const db = require("../models");
const { sequelize } = db;
const { Op, Model } = require("sequelize");
const { emptyToNull } = require("./empty-to-null");

exports.brachytherapyConsentFormService = async (id, body) => {
  const t = await sequelize.transaction();

  try {
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
      staff_id,
      staff_position,
      staff_sign,
      staff_sign_date,
      doctor_id,
      doctor_sign,
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
      doctor_sign_existing,
    ] = await Promise.all([
      db.PatientContacts.findOne({ where: { form_id: id } }),
      db.PatSign.findOne({ where: { form_id: id } }),
      db.WitnessSign.findOne({ where: { form_id: id } }),
      db.StaffSign.findOne({ where: { form_id: id } }),
      db.DoctorSign.findOne({ where: { form_id: id } }),
    ]);

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
          patient_sign,
          patient_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.PatSign.create(
        {
          form_id: id,
          hn: hn,
          patient_sign,
          patient_sign_date,
        },
        { transaction: t },
      );
    }
    if (witness_sign_existing) {
      await db.WitnessSign.update(
        {
          witness_name,
          witness_sign,
          witness_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.WitnessSign.create(
        {
          form_id: id,
          witness_name,
          witness_sign,
          witness_sign_date,
        },
        { transaction: t },
      );
    }
    if (staff_sign_existing) {
      await db.StaffSign.update(
        {
          staff_id,
          staff_position,
          staff_sign,
          staff_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.StaffSign.create(
        {
          form_id: id,
          staff_id,
          staff_position,
          staff_sign,
          staff_sign_date,
        },
        { transaction: t },
      );
    }
    if (doctor_sign_existing) {
      await db.DoctorSign.update(
        {
          doctor_id,
          doctor_sign,
          doctor_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.DoctorSign.create(
        {
          form_id: id,
          doctor_id,
          doctor_sign,
          doctor_sign_date,
        },
        { transaction: t },
      );
    }
    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();

    throw error;
  }
};
