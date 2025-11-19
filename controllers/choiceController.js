const db = require("../models");
const { sequelize } = db;

exports.choice = async (req, res) => {
  try {
    const choice = await db.Choice.findAll({
      attributes: ["id", "choice_type_id", "choice_name", "flag_active"],
      include: [
        { model: db.ChoiceType, as: "choice_type", attributes: ["type_name"] },
      ],
    });
    res.json(choice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
