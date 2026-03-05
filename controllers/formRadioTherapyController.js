const db = require("../models");
const { sequelize } = db;
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
    const form = await db.Form.findOne({
      where: { id: id },
      include: [
        { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] },
      ],
    });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const [pat, pat_visit, pat_vitalsign] = await Promise.all([
      await db.Pat.findOne({
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
      await db.PatVisit.findOne({
        where: {
          hn: form.hn,
        },
      }),
      await db.PatVitalSign.findOne({
        where: {
          hn: form.hn,
        },
      }),
    ]);

    const result = {
      data_form: form,
      data_pat: { pat, pat_visit, pat_vitalsign },
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.edit_form = async (req, res) => {
  const { id } = res.params;
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
      },
      { where: { id: id }, transaction: t },
    );
    const patient_contact = await db.PatientContacts.upsert(
      {
        name,
        relation,
      },
      { where: { form_id: id }, transaction: t },
    );
    const congenital_disease = await db.CongenitalDisease.upsert(
      {
        condition_id,
      },
      { where: { form_id: id }, transaction: t },
    );
    const contrast_allergy_status = await db.ContrastAllergyStatus.upsert(
      {
        contrast_allergy_id,
        contrast_allergy_symptom,
      },
      { where: { form_id: id }, transaction: t },
    );
    const contrast_history_status = await db.ContrastHistoryStatus.upsert(
      {
        contrast_history_id,
      },
      { where: { form_id: id }, transaction: t },
    );
    const drug_allergy_status = await db.DrugAllergyStatus.upsert(
      {
        drug_allergy_id,
        drug,
      },
      { where: { form_id: id }, transaction: t },
    );
    const seafood_allergy_status = await db.SeafoodAllergyStatus.upsert(
      {
        seafood_allergy_id,
        seafood_allergy_symptom,
      },
      { where: { form_id: id }, transaction: t },
    );
    const pat_sign = await db.PatSign.upsert(
      {
        hn: form.hn,
        patient_sign,
        patient_sign_date,
      },
      { where: { form_id: id }, transaction: t },
    );
    const witness_signs = await db.WitnessSign.upsert(
      {
        witness_name,
        witness_sign,
        witness_sign_date,
      },
      { where: { form_id: id }, transaction: t },
    );
    const staff_signs = await db.StaffSign.upsert(
      {
        staff_id,
        staff_position,
        staff_sign,
        staff_sign_date,
      },
      { where: { form_id: id }, transaction: t },
    );
    const doctor_signs = await db.DoctorSign.upsert(
      {
        doctor_id,
        doctor_sign,
        doctor_sign_date,
      },
      { where: { form_id: id }, transaction: t },
    );

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
    (res.status(500), json({ message: error.message }));
  }
};
