const db = require("../models");
const { sequelize } = db;

exports.form_list = async (req, res) => {
  try {
    const form_list = await db.Form.findAll();
    res.json(form_list);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
