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
        { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] }
      ]
    });

    const data_form_list = []
    for (const item of form_list) {
      const pat = await db.Pat.findByPk(item.hn)

      data_form_list.push({
        id: item.id,
        hn: item.hn,
        name: pat
          ? `${pat.prename}${pat.firstname} ${pat.lastname}`
          : null,
        form_type: item.FormTypeName
          ? item.FormTypeName.form_name
          : null,
        status: item.form_status,
        form_type_id: item.form_type_id
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
        hn: hn
      },
      include: [
        { model: db.FormType, as: "FormTypeName", attributes: ["form_name"] }
      ]
    });

    const data_form_list = []
    for (const item of form_list) {
      const pat = await db.Pat.findByPk(item.hn)

      data_form_list.push({
        id: item.id,
        hn: item.hn,
        name: pat
          ? `${pat.prename}${pat.firstname} ${pat.lastname}`
          : null,
        form_type: item.FormTypeName
          ? item.FormTypeName.form_name
          : null,
        status: item.form_status,
        form_type_id: item.form_type_id
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
