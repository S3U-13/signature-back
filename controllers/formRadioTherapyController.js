const db = require("../models");
const { sequelize } = db;
const { Op, fn, col, where } = require("sequelize");
const { emptyToNull } = require("../utils/empty-to-null");
const { signBuffers } = require("../utils/signatureInputHelper");
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
    const { search, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { sortField = "createdAt", sortOrder = "desc" } = req.query;

    // 🔍 เงื่อนไข query form
    const fields = ["creator", "viewer", "staff_id", "nurse_id"];

    const orConditions = fields.map((f) => ({
      [f]: req.user.userid,
    }));

    if (req.user.doctorid) {
      orConditions.push({ doctor_id: req.user.doctorid });
    }

    const whereCondition = {
      ...(status && { form_status: status }),
      [Op.or]: orConditions,
    };

    // 📄 ดึง Form
    const { rows: form_list = [], count: total = 0 } =
      await db.Form.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        include: [
          {
            model: db.FormType,
            as: "FormTypeName",
            attributes: ["form_name"],
          },
        ],
        order: [[sortField, sortOrder]],
      });

    // 📌 ดึง HN จาก form
    const hnFromForm = form_list.map((item) => item.hn);

    // 📌 ดึงข้อมูล Pat
    const pats = await db.Pat.findAll({
      where: {
        hn: {
          [Op.in]: hnFromForm,
        },
      },
    });

    // 📦 map pat
    const patMap = {};
    for (const p of pats) {
      patMap[p.hn] = p;
    }

    const keyword = search ? search.toLowerCase() : null;

    // 🔥 map + filter
    const data_form_list = form_list
      .map((item) => {
        const pat = patMap[item.hn]; // ✅ สำคัญ

        const isNew = new Date(item.createdAt) > Date.now() - 5 * 60 * 1000;

        const isUpdated =
          item.updatedAt &&
          item.createdAt !== item.updatedAt &&
          new Date(item.updatedAt) > Date.now() - 5 * 60 * 1000;

        const fullName = pat
          ? `${pat.prename || ""}${pat.firstname || ""} ${pat.lastname || ""}`
          : "";

        const hn = String(item.hn || ""); // ✅ แก้ตรงนี้

        return {
          id: item.id ?? null,
          hn: hn,
          name: fullName,
          form_type: item.FormTypeName?.form_name ?? null,
          status: item.form_status ?? null,
          form_type_id: item.form_type_id ?? null,
          createdAt: item.createdAt ?? null,
          isNew,
          isUpdated,

          _search: {
            fullName: fullName.toLowerCase(),
            hn: hn.toLowerCase(),
          },
        };
      })
      .filter((item) => {
        if (!keyword) return true;

        return (
          item._search.fullName.includes(keyword) ||
          item._search.hn.includes(keyword)
        );
      })
      .map((item) => {
        delete item._search;
        return item;
      });

    return res.json({
      data: data_form_list,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        from: total === 0 ? 0 : (page - 1) * limit + 1,
        to: Math.min(page * limit, total),
      },
    });
  } catch (error) {
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
        createdAt: item.createdAt ?? null,
      });
    }

    return res.json(data_form_list);
  } catch (error) {
    // message error
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// create create_form_by_doc
exports.crate_form = async (req, res) => {
  const t = await sequelize.transaction();
  const userId = req.user.userid;
  try {
    const cleanedBody = emptyToNull(req.body);

    const {
      form_type_id,
      hn,
      visit_id,
      vitalsign_id,
      disease,
      lmp,
      doctor_sign,
      doctor_sign_date,
      doctor_id,
      staff_id,
      nurse_id,
      viewer,
    } = cleanedBody;

    const requiredFields = ["hn", "form_type_id"];
    for (const field of requiredFields) {
      if (!cleanedBody[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    const doctor_user = await db.DoctorUser.findOne({
      where: {
        doctorid: doctor_id,
      },
    });

    const form = await db.Form.create(
      {
        form_type_id,
        hn,
        visit_id,
        vitalsign_id,
        disease,
        lmp,
        consent: null,
        doctor_id,
        doctor_userid: doctor_user.userid,
        staff_id,
        nurse_id,
        viewer,
        creator: userId,
      },
      { transaction: t },
    );

    const actions = [];

    if (staff_id) {
      actions.push({
        form_id: form.id,
        role: "staff",
        userid: staff_id,
        status: "pending",
      });
    }

    if (nurse_id) {
      actions.push({
        form_id: form.id,
        role: "nurse",
        userid: nurse_id,
        status: "pending",
      });
    }

    if (doctor_id) {
      actions.push({
        form_id: form.id,
        role: "doctor",
        userid: doctor_user.userid,
        doctorid: doctor_id,
        status: "pending",
      });
    }

    await db.FormAction.bulkCreate(actions, { transaction: t });

    // let buffer = {};

    // if (doctor_sign) {
    //   buffer = signBuffers({ doctor_sign });
    // }

    // const doctor_signs = await db.DoctorSign.create(
    //   {
    //     form_id: form.id,
    //     doctor_id: form.doctor_id,
    //     // doctor_sign: buffer.doctor_sign,
    //     doctor_sign_date,
    //   },
    //   { transaction: t },
    // );

    await t.commit();

    const targets = [staff_id, nurse_id, doctor_user?.userid].filter(Boolean);

    targets.forEach((uid) => {
      global.io.to(`user_${uid}`).emit("new-notification", {
        form_id: form.id,
        message: "มีเอกสารใหม่ให้เซ็น",
      });
    });

    res.status(200).json({
      message: "เพิ่มข้อมูลสำเร็จ",
      // form,
      // doctor_signs,
    });
  } catch (error) {
    await t.rollback();

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.show_pat_form_by_form_id = async (req, res) => {
  const cookie = req.headers.cookie;
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
      staff_note,
    ] = await Promise.all([
      db.Form.findOne({
        where: { id: id },
        include: [
          { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] },
        ],
      }),
      db.PatientContacts.findOne({
        where: { form_id: id },
      }),
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
      db.StaffNote.findOne({ where: { form_id: id } }),
    ]);

    const UserSignMapById = {
      staff_sign_id: staff_sign?.signature_id,
      nurse_sign_id: nurse_sign?.signature_id,
    };

    let users_sign = {};

    for (const [key, signature_id] of Object.entries(UserSignMapById)) {
      if (signature_id) {
        const userSignData = await db.UserSign.findOne({
          where: {
            id: signature_id,
            flag_type: "A",
            flag_default: "Y",
            flag_cancel: "N",
          },
          include: [{ model: db.UserSignData, as: "SignData" }],
        });
        users_sign[key] = userSignData;
      }
    }

    const doctorSignId = doctor_sign?.signature_id;

    let doctor_sign_data = null;
    if (doctorSignId) {
      doctor_sign_data = await db.DoctorImage.findOne({
        where: {
          id: doctorSignId,
          flag_type: "A",
          flag_default: "Y",
          flag_cancel: "N",
        },
        include: [{ model: db.DoctorImageData, as: "DoctorSignData" }],
      });
    }

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    let relation = null;

    if (patient_contacts?.relation) {
      relation = await db.Lookup.findOne({
        where: {
          lookupid: patient_contacts.relation,
          lookuptypeid: 19,
          active: "Y",
        },
      });
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

    let staff_user = null;
    if (form.staff_id) {
      staff_user = await fetch(
        `${process.env.API_URL}user/user-ppk-by-userid/${form?.staff_id}`,
        { headers: { Cookie: cookie } },
      ).then((res) => res.json());
    }
    let nurse_user = null;
    if (form.nurse_id) {
      nurse_user = await fetch(
        `${process.env.API_URL}user/user-ppk-by-userid/${form?.nurse_id}`,
        { headers: { Cookie: cookie } },
      ).then((res) => res.json());
    }
    let doctor_user = null;
    if (form.doctor_id) {
      doctor_user = await fetch(
        `${process.env.API_URL}user/doctor-ppk-by-doctorid/${form?.doctor_id}`,
        { headers: { Cookie: cookie } },
      ).then((res) => res.json());
    }

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

    if (users_sign.staff_sign_id?.SignData?.signature) {
      StaffSign = signBase64(users_sign.staff_sign_id?.SignData?.signature);
    }
    const staffsign = {
      staff_id: staff_sign?.staff_id,
      staff_sign_date: staff_sign?.staff_sign_date,
      staff_sign: StaffSign,
      signature_id: staff_sign?.signature_id,
    };
    //nurse_sign
    let NurseSign = null;

    if (users_sign.nurse_sign_id?.SignData?.signature) {
      NurseSign = signBase64(users_sign.nurse_sign_id?.SignData?.signature);
    }
    const nursesign = {
      nurse_id: nurse_sign?.nurse_id,
      nurse_sign_date: nurse_sign?.nurse_sign_date,
      nurse_sign: NurseSign,
      signature_id: nurse_sign?.signature_id,
    };

    //doctor sing
    let docSign = null;

    if (doctor_sign_data?.DoctorSignData?.imagedata) {
      docSign = signBase64(doctor_sign_data?.DoctorSignData?.imagedata);
    }
    const doctorsign = {
      doctor_id: doctor_sign?.doctor_id ?? null,
      doctor_sign_date: doctor_sign?.doctor_sign_date ?? null,
      doctor_sign: docSign,
      doctor_name: doctor_user?.user_data?.person_name ?? null,
      signature_id: doctor_sign?.signature_id,
    };

    const patient_contact = {
      id: patient_contacts?.id ?? null,
      form_id: patient_contacts?.form_id ?? null,
      name: patient_contacts?.name ?? null,
      relation: patient_contacts?.relation ?? null,
      relation_name: relation?.lookupname ?? null,
      flag_status: patient_contacts?.flag_status ?? null,
    };

    const result = {
      data_form: {
        form: form ?? {},
        patient_contact: patient_contact ?? {},
        congenital_disease: congenital_disease ?? [],
        contrast_history_status: contrast_history_status ?? {},
        contrast_allergy_status: contrast_allergy_status ?? {},
        seafood_allergy_status: seafood_allergy_status ?? {},
        drug_allergy_status: drug_allergy_status ?? {},
        patientsign: patientsign ?? null,
        witnesssign: witnesssign ?? null,
        staffsign: staffsign ?? null,
        nursesign: nursesign ?? null,
        doctorsign: doctorsign ?? null,
        doctor_user: doctor_user.user_data ?? null,
        staff_user: staff_user.user_data ?? null,
        nurse_user: nurse_user.user_data ?? null,
        staff_note: staff_note ?? null,
      },
      data_pat: {
        pat: pat ?? {},
        pat_visit: pat_visit ?? {},
        pat_vitalsign: pat_vitalsign ?? {},
      },
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
        await simulationConsentFormService(id, req.body, req.user);
        break;

      case 2:
        await radiotherapyConsentFormService(id, req.body, req.user);
        break;

      case 3:
        await brachytherapyConsentFormService(id, req.body, req.user);
        break;

      default:
        return res.status(400).json({ message: "Invalid form type" });
    }

    return res.json({ message: "update success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
