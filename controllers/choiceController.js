const db = require("../models");
const { sequelize } = db;

exports.choice = async (req, res) => {
  try {
    const options = await db.Option.findAll({
      attributes: ["id", "option_group_id", "name", "flag_status"],
      include: [
        { model: db.OptionGroup, as: "OptionGroupName", attributes: ["name"] },
      ],
    });
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
