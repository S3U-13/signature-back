const db = require("../models");
const { Op } = require("sequelize");

exports.pat = async (req, res) => {
  try {
    const { value } = req.params;

    const pat = await db.Pat.findOne({
      where: {
        [Op.or]: [{ hn: value }, { citizencardno: value }],
      },
    });

    if (!pat) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(pat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
