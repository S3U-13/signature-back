const db = require("../models");
const { sequelize } = db;
const { Op, Model } = require("sequelize");
const { emptyToNull } = require("../utils/empty-to-null");
const { base64ToBuffer } = require("../utils/signatureInputHelper");

exports.simulationConsentFormService = async (id, body) => {
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
      congenital_diseases,
      contrast_allergy_id,
      contrast_allergy_symptom,
      contrast_history_id,
      drug_allergy_id,
      drug,
      seafood_allergy_id,
      seafood_allergy_symptom,
      patient_sign,
      patient_sign_date,
      witness_name,
      witness_sign,
      witness_sign_date,
      staff_id,
      staff_position,
      staff_sign,
      staff_sign_date,
      nurse_id,
      nurse_sign,
      nurse_sign_date,
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
      contrast_allergy_status_existing,
      contrast_history_status_existing,
      drug_allergy_status_existing,
      seafood_allergy_status_existing,
      pat_sign_existing,
      witness_sign_existing,
      staff_sign_existing,
      nurse_sign_existing,
    ] = await Promise.all([
      db.PatientContacts.findOne({ where: { form_id: id }, transaction: t }),
      db.ContrastAllergyStatus.findOne({
        where: { form_id: id },
        transaction: t,
      }),
      db.ContrastHistoryStatus.findOne({
        where: { form_id: id },
        transaction: t,
      }),
      db.DrugAllergyStatus.findOne({ where: { form_id: id }, transaction: t }),
      db.SeafoodAllergyStatus.findOne({
        where: { form_id: id },
        transaction: t,
      }),
      db.PatSign.findOne({ where: { form_id: id }, transaction: t }),
      db.WitnessSign.findOne({ where: { form_id: id }, transaction: t }),
      db.StaffSign.findOne({ where: { form_id: id }, transaction: t }),
      db.NurseSign.findOne({ where: { form_id: id }, transaction: t }),
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

    await db.CongenitalDisease.destroy({
      where: { form_id: id },
      transaction: t,
    });

    if (Array.isArray(congenital_diseases) && congenital_diseases.length) {
      await db.CongenitalDisease.bulkCreate(
        congenital_diseases.map((cd) => ({
          form_id: id,
          condition_id: cd.condition_id,
        })),
        { transaction: t },
      );
    }

    if (contrast_allergy_status_existing) {
      await db.ContrastAllergyStatus.update(
        {
          contrast_allergy_id,
          contrast_allergy_symptom,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.ContrastAllergyStatus.create(
        {
          form_id: id,
          contrast_allergy_id,
          contrast_allergy_symptom,
        },
        { transaction: t },
      );
    }
    if (contrast_history_status_existing) {
      await db.ContrastHistoryStatus.update(
        {
          contrast_history_id,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.ContrastHistoryStatus.create(
        {
          form_id: id,
          contrast_history_id,
        },
        { transaction: t },
      );
    }
    if (drug_allergy_status_existing) {
      await db.DrugAllergyStatus.update(
        {
          drug_allergy_id,
          drug,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.DrugAllergyStatus.create(
        {
          form_id: id,
          drug_allergy_id,
          drug,
        },
        { transaction: t },
      );
    }
    if (seafood_allergy_status_existing) {
      await db.SeafoodAllergyStatus.update(
        {
          seafood_allergy_id,
          seafood_allergy_symptom,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.SeafoodAllergyStatus.create(
        {
          form_id: id,
          seafood_allergy_id,
          seafood_allergy_symptom,
        },
        { transaction: t },
      );
    }

    const patient_buffer = base64ToBuffer(patient_sign);
    if (pat_sign_existing) {
      await db.PatSign.update(
        {
          hn: hn,
          patient_sign: patient_buffer,
          patient_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.PatSign.create(
        {
          form_id: id,
          hn: hn,
          patient_sign: patient_buffer,
          patient_sign_date,
        },
        { transaction: t },
      );
    }

    const witness_buffer = base64ToBuffer(witness_sign);
    if (witness_sign_existing) {
      await db.WitnessSign.update(
        {
          witness_name,
          witness_sign: witness_buffer,
          witness_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.WitnessSign.create(
        {
          form_id: id,
          witness_name,
          witness_sign: witness_buffer,
          witness_sign_date,
        },
        { transaction: t },
      );
    }

    const staff_buffer = base64ToBuffer(staff_sign);
    if (staff_sign_existing) {
      await db.StaffSign.update(
        {
          staff_id,
          staff_position,
          staff_sign: staff_buffer,
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
          staff_sign: staff_buffer,
          staff_sign_date,
        },
        { transaction: t },
      );
    }

    const nurse_buffer = base64ToBuffer(nurse_sign);
    if (nurse_sign_existing) {
      await db.NurseSign.update(
        {
          nurse_id,
          nurse_sign: nurse_buffer,
          nurse_sign_date,
        },
        { where: { form_id: id }, transaction: t },
      );
    } else {
      await db.NurseSign.create(
        {
          form_id: id,
          nurse_id,
          nurse_sign: nurse_buffer,
          nurse_sign_date,
        },
        { transaction: t },
      );
    }
    await t.commit();

    console.log("nurse_sign type:", typeof nurse_sign);
    console.log("nurse_sign:", nurse_sign);
    return true;
  } catch (error) {
    await t.rollback();

    throw error;
  }
};
