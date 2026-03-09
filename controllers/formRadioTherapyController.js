const db = require("../models");
const { sequelize } = db;
const { Op, Model } = require("sequelize");
const { emptyToNull } = require("../services/empty-to-null");

// create function form_list
exports.form_list = async (req, res) => {
  try {
    // form_list เพื่อ ค้นหา ข้อมูลทั้ง หมดใน table นั้นมาเเสดง
    const form_list = await db.Form.findAll({
      // attributes: ["id", "form_type_id", "hn", "createdAt",],
      include: [
        { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] },
      ],
    });

    const data_form_list = [];
    for (const item of form_list || []) {
      const pat = await db.Pat.findOne({
        where: { hn: item.hn },
      });

      data_form_list.push({
        id: item.id ?? null,
        hn: item.hn ?? null,
        name: pat ? `${pat.prename}${pat.firstname} ${pat.lastname}` : null,
        form_type: item.FormTypeName ? item.FormTypeName.form_name : null,
        status: item.form_status ?? null,
        form_type_id: item.form_type_id ?? null,
      });
    }

    return res.json(data_form_list);
  } catch (error) {
    // message error
    console.error("FORM_LIST_ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

exports.search_hn_form_list = async (req, res) => {
  const { hn } = req.params;
  try {
    // form_list เพื่อ ค้นหา ข้อมูลทั้ง หมดใน table นั้นมาเเสดง
    const form_list = await db.Form.findAll({
      // attributes: ["id", "form_type_id", "hn", "createdAt",],
      where: {
        hn: hn,
      },
      include: [
        { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] },
      ],
    });

    const data_form_list = [];
    for (const item of form_list) {
      const pat = await db.Pat.findByPk(item.hn);

      data_form_list.push({
        id: item.id,
        hn: item.hn,
        name: pat ? `${pat.prename}${pat.firstname} ${pat.lastname}` : null,
        form_type: item.FormTypeName ? item.FormTypeName.form_name : null,
        status: item.form_status,
        form_type_id: item.form_type_id,
      });
    }

    return res.json(data_form_list);
  } catch (error) {
    // message error
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// create create_form_by_doc
exports.crate_form_by_doc = async (req, res) => {
  try {
    // function เเปลงค่าว่างเป็น null
    const cleanedBody = emptyToNull(req.body);
    // ประกาศ field รับค่า req
    const { form_type_id, hn, visit_id, vitalsign_id, disease, lmp, consent } =
      cleanedBody;

    // ประกาศ field สำคัญ ที่ req ต้อง การ
    const requiredFields = ["hn", "form_type_id"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // create data to db
    const form = await db.Form.create({
      form_type_id,
      hn,
      visit_id,
      vitalsign_id,
      disease,
      lmp,
      consent,
    });

    // message success
    res.status(200).json({ message: "เพิ่มข้อมูลสำเร็จ", form });
  } catch (error) {
    //message error
    (res.status(500), json({ message: error.message }));
  }
};

exports.show_pat_form_by_form_id = async (req, res) => {
  const { id } = req.params;
  try {
    const [
      form,
      patient_contacts,
      congenital_disease,
      contrast_history_status,
      contrast_allergy_status,
      seafood_allergy_status,
      drug_allergy_status,
      pat_sign,
      witness_sign,
      staff_sign,
      doctor_sign,
    ] = await Promise.all([
      db.Form.findOne({
        where: { id: id },
        include: [
          { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] },
        ],
      }),
      db.PatientContacts.findOne({ where: { form_id: id } }),
      db.CongenitalDisease.findAll({ where: { form_id: id } }),
      db.ContrastHistoryStatus.findOne({ where: { form_id: id } }),
      db.ContrastAllergyStatus.findOne({ where: { form_id: id } }),
      db.SeafoodAllergyStatus.findOne({ where: { form_id: id } }),
      db.DrugAllergyStatus.findOne({ where: { form_id: id } }),
      db.PatSign.findOne({ where: { form_id: id } }),
      db.WitnessSign.findOne({ where: { form_id: id } }),
      db.StaffSign.findOne({ where: { form_id: id } }),
      db.DoctorSign.findOne({ where: { form_id: id } }),
    ]);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const now = new Date();
    // const oneYearAgo = new Date();
    // oneYearAgo.setFullYear(now.getFullYear() - 1);
    const elevenMonthAgo = new Date();
    elevenMonthAgo.setMonth(now.getMonth() - 11);
    const tenMonthAgo = new Date();
    tenMonthAgo.setMonth(now.getMonth() - 10);

    const [pat, pat_visit, pat_vitalsign] = await Promise.all([
      db.Pat.findOne({
        where: {
          hn: form.hn,
        },
        include: [
          {
            model: db.Lookup,
            as: "occupation_detail",
            attributes: ["lookupname"],
          },
          {
            model: db.Lookup,
            as: "sex_name",
            attributes: ["lookupname"],
            where: { lookuptypeid: 12 },
          },
          {
            model: db.Lookup,
            as: "race_text",
            attributes: ["lookupname"],
            where: { lookuptypeid: 15 },
          },
          {
            model: db.Lookup,
            as: "citizenship_text",
            attributes: ["lookupname"],
            where: { lookuptypeid: 15 },
          },
        ],
      }),
      db.PatVisit.findOne({
        where: {
          id: form.visit_id,
          // visitdatetime: {
          //   // [Op.gte]: oneYearAgo,
          //   [Op.gte]: elevenMonthAgo,
          // },
        },
      }),
      db.PatVitalSign.findOne({
        where: {
          id: form.vitalsign_id,
          // dodate: {
          //   // [Op.gte]: oneYearAgo,
          //   [Op.gte]: tenMonthAgo,
          // },
        },
      }),
    ]);

    const result = {
      data_form: {
        form,
        patient_contacts,
        congenital_disease,
        contrast_history_status,
        contrast_allergy_status,
        seafood_allergy_status,
        drug_allergy_status,
        pat_sign,
        witness_sign,
        staff_sign,
        doctor_sign,
      },
      data_pat: { pat, pat_visit, pat_vitalsign },
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.edit_form = async (req, res) => {
  const t = await sequelize.transaction();
  const { id } = req.params;
  try {
    // function เเปลงค่าว่างเป็น null
    const cleanedBody = emptyToNull(req.body);
    // ประกาศ field รับค่า req
    const {
      form_type_id,
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
      doctor_id,
      doctor_sign,
      doctor_sign_date,
    } = cleanedBody;

    // ประกาศ field สำคัญ ที่ req ต้อง การ
    const requiredFields = ["hn"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (!id) {
      return res.status(400).json({ message: "id is required" });
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
      doctor_sign_existing
    ] = await Promise.all([
      db.PatientContacts.findOne(
        { where: { form_id: id }, },
      ),
      db.ContrastAllergyStatus.findOne(
        { where: { form_id: id }, },
      ),
      db.ContrastHistoryStatus.findOne(
        { where: { form_id: id }, },
      ),
      db.DrugAllergyStatus.findOne(
        { where: { form_id: id }, },
      ),
      db.SeafoodAllergyStatus.findOne(
        { where: { form_id: id }, },
      ),
      db.PatSign.findOne(
        { where: { form_id: id }, },
      ),
      db.WitnessSign.findOne(
        { where: { form_id: id }, },
      ),
      db.StaffSign.findOne(
        { where: { form_id: id }, },
      ),
      db.DoctorSign.findOne(
        { where: { form_id: id }, },
      ),
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
        { transaction: t }
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

    // message success
    return res.status(200).json({
      message: "เเก้ข้อมูลสำเร็จ",
      form,
      patient_contact_existing,
      contrast_allergy_status_existing,
      contrast_history_status_existing,
      drug_allergy_status_existing,
      seafood_allergy_status_existing,
      pat_sign_existing,
      witness_sign_existing,
      staff_sign_existing,
      doctor_sign_existing
    });
  } catch (error) {
    //message error
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};
