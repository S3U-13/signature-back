const db = require("../models");
const { sequelize } = db;
const { Op, Model } = require("sequelize");
const { emptyToNull } = require("../utils/empty-to-null");
const {
  simulationConsentFormService,
} = require("../services/simulationConsentFormService");
const {
  radiotherapyConsentFormService,
} = require("../services/radiotherapyConsentFormService");
const {
  brachytherapyConsentFormService,
} = require("../services/brachytherapyConsentFormService");
const { signBase64 } = require("../utils/singBase64Service");

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
  const t = await sequelize.transaction();

  try {
    const cleanedBody = emptyToNull(req.body);

    const {
      form_type_id,
      hn,
      visit_id,
      vitalsign_id,
      disease,
      lmp,
      consent,
      doctor_id,
      doctor_sign,
      doctor_sign_date,
    } = cleanedBody;

    const requiredFields = ["hn", "form_type_id"];
    for (const field of requiredFields) {
      if (!cleanedBody[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const form = await db.Form.create(
      {
        form_type_id,
        hn,
        visit_id,
        vitalsign_id,
        disease,
        lmp,
        consent,
      },
      { transaction: t },
    );

    let buffer_doctor;

    if (doctor_sign) {
      const base64 = doctor_sign.replace(/^data:image\/png;base64,/, "");
      buffer_doctor = Buffer.from(base64, "base64");
    }

    const doctor_signs = await db.DoctorSign.create(
      {
        form_id: form.id,
        doctor_id,
        doctor_sign: buffer_doctor,
        doctor_sign_date,
      },
      { transaction: t },
    );

    await t.commit();

    res.status(200).json({
      message: "เพิ่มข้อมูลสำเร็จ",
      form,
      doctor_signs,
    });
  } catch (error) {
    await t.rollback();

    res.status(500).json({
      message: error.message,
    });
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
      nurse_sign,
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
      db.NurseSign.findOne({ where: { form_id: id } }),
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
            where: { lookuptypeid: 16 },
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

    //patient_sign
    let PatientSign = null;

    if (pat_sign?.patient_sign) {
      PatientSign = signBase64(pat_sign?.patient_sign);
    }
    const patientsign = {
      hn: pat_sign?.hn,
      patient_sign_date: pat_sign?.patient_sign_date,
      patient_sign: PatientSign,
    };
    //witness_sign
    let WitnessSign = null;

    if (witness_sign?.witness_sign) {
      WitnessSign = signBase64(witness_sign?.witness_sign);
    }
    const witnesssign = {
      witness_name: witness_sign?.witness_name,
      witness_sign_date: witness_sign?.witness_sign_date,
      witness_sign: WitnessSign,
    };
    //staff_sign
    let StaffSign = null;

    if (staff_sign?.staff_sign) {
      StaffSign = signBase64(staff_sign?.staff_sign);
    }
    const staffsign = {
      staff_id: staff_sign?.staff_id,
      staff_sign_date: staff_sign?.staff_sign_date,
      staff_sign: StaffSign,
    };
    //nurse_sign
    let NurseSign = null;

    if (nurse_sign?.nurse_sign) {
      NurseSign = signBase64(nurse_sign?.nurse_sign);
    }
    const nursesign = {
      nurse_id: nurse_sign?.nurse_id,
      nurse_sign_date: nurse_sign?.nurse_sign_date,
      nurse_sign: NurseSign,
    };

    //doctor sing
    let docSign = null;

    if (doctor_sign?.doctor_sign) {
      docSign = signBase64(doctor_sign?.doctor_sign);
    }
    const doctorsign = {
      doctor_id: doctor_sign.doctor_id,
      doctor_sign_date: doctor_sign.doctor_sign_date,
      docSign,
    };

    const result = {
      data_form: {
        form,
        patient_contacts,
        congenital_disease,
        contrast_history_status,
        contrast_allergy_status,
        seafood_allergy_status,
        drug_allergy_status,
        patientsign,
        witnesssign,
        staffsign,
        nursesign,
        doctorsign,
      },
      data_pat: { pat, pat_visit, pat_vitalsign },
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.edit_form = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const form = await db.Form.findOne({ where: { id } });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    switch (form.form_type_id) {
      case 1:
        await simulationConsentFormService(id, req.body);
        break;

      case 2:
        await radiotherapyConsentFormService(id, req.body);
        break;

      case 3:
        await brachytherapyConsentFormService(id, req.body);
        break;

      default:
        return res.status(400).json({ message: "Invalid form type" });
    }

    return res.json({ message: "update success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
