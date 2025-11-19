const db = require("../models");
const { sequelize } = db;

exports.form = async (req, res) => {
  try {
    const form = await db.FormType.findAll({
      attributes: ["code", "form_name", "flag_active"],
    });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
