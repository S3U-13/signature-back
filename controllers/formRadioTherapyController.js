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

    res.json(data_form_list);
  } catch (error) {
    // message error
    res.status(500).json({ error: "Something went wrong!" });
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

    res.json(data_form_list);
  } catch (error) {
    // message error
    res.status(500).json({ error: "Something went wrong!" });
  }
};

// create create_form_by_doc
exports.crate_form_by_doc = async (req, res) => {
  try {
    // function เเปลงค่าว่างเป็น null
    const cleanedBody = emptyToNull(req.body);
    // ประกาศ field รับค่า req
    const { form_type_id, hn, disease, lmp, consent } = cleanedBody;

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
      doctor_sign
    ] = await Promise.all([
      db.Form.findOne({
        where: { id: id },
        include: [
          { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] },
        ],
      }),
      db.PatientContacts.findOne({ where: { form_id: id } }),
      db.CongenitalDisease.findOne({ where: { form_id: id } }),
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
      db.PatVisit.findAll({
        where: {
          hn: form.hn,
          visitdatetime: {
            // [Op.gte]: oneYearAgo,
            [Op.gte]: elevenMonthAgo,
          },
        },
      }),
      db.PatVitalSign.findAll({
        where: {
          hn: form.hn,
          dodate: {
            // [Op.gte]: oneYearAgo,
            [Op.gte]: tenMonthAgo,
          },
        },
      }),
    ]);

    const result = {
      data_form: {
        form, patient_contacts,
        congenital_disease,
        contrast_history_status,
        contrast_allergy_status,
        seafood_allergy_status,
        drug_allergy_status,
        pat_sign,
        witness_sign,
        staff_sign,
        doctor_sign
      },
      data_pat: { pat, pat_visit, pat_vitalsign },
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      condition_id,
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
    const requiredFields = ["hn", "form_type_id"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // create data to db
    const form = await db.Form.update(
      {
        form_type_id,
        hn,
        disease,
        lmp,
        consent,
        form_status: "Save",
      },
      { where: { id: id }, transaction: t },
    );
    const patient_contact = await db.PatientContacts.upsert(
      {
        form_id: id,
        name,
        relation,
      },
      { transaction: t },
    );
    const congenital_disease = await db.CongenitalDisease.upsert(
      {
        form_id: id,
        condition_id,
      },
      { transaction: t },
    );
    const contrast_allergy_status = await db.ContrastAllergyStatus.upsert(
      {
        form_id: id,
        contrast_allergy_id,
        contrast_allergy_symptom,
      },
      { transaction: t },
    );
    const contrast_history_status = await db.ContrastHistoryStatus.upsert(
      {
        form_id: id,
        contrast_history_id,
      },
      { transaction: t },
    );
    const drug_allergy_status = await db.DrugAllergyStatus.upsert(
      {
        form_id: id,
        drug_allergy_id,
        drug,
      },
      { transaction: t },
    );
    const seafood_allergy_status = await db.SeafoodAllergyStatus.upsert(
      {
        form_id: id,
        seafood_allergy_id,
        seafood_allergy_symptom,
      },
      { transaction: t },
    );
    const pat_sign = await db.PatSign.upsert(
      {
        form_id: id,
        hn: hn,
        patient_sign,
        patient_sign_date,
      },
      { transaction: t },
    );
    const witness_signs = await db.WitnessSign.upsert(
      {
        form_id: id,
        witness_name,
        witness_sign,
        witness_sign_date,
      },
      { transaction: t },
    );
    const staff_signs = await db.StaffSign.upsert(
      {
        form_id: id,
        staff_id,
        staff_position,
        staff_sign,
        staff_sign_date,
      },
      { transaction: t },
    );
    const doctor_signs = await db.DoctorSign.upsert(
      {
        form_id: id,
        doctor_id,
        doctor_sign,
        doctor_sign_date,
      },
      { transaction: t },
    );
    await t.commit();

    // message success
    res.status(200).json({
      message: "เเก้ข้อมูลสำเร็จ",
      form,
      patient_contact,
      congenital_disease,
      contrast_allergy_status,
      contrast_history_status,
      drug_allergy_status,
      seafood_allergy_status,
      pat_sign,
      witness_signs,
      staff_signs,
      doctor_signs,
    });
  } catch (error) {
    //message error
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
