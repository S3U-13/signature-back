const db = require("../models");
const { sequelize } = db;

exports.form = async (req, res) => {
  try {
    const form = await db.FormType.findAll({
      attributes: ["id", "form_name", "flag_status"],
    });
    res.json(form);
    console.log(form);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
