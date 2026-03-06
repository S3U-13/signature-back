const db = require("../models");
const { Op } = require("sequelize");
// service
const now = new Date();
const elevenMonthAgo = new Date();
elevenMonthAgo.setMonth(now.getMonth() - 11);
const tenMonthAgo = new Date();
tenMonthAgo.setMonth(now.getMonth() - 10);

exports.pat = async (req, res) => {
  try {
    const { value } = req.params;

    const pat = await db.Pat.findOne({
      where: {
        [Op.or]: [{ hn: value }, { citizencardno: value }],
      },
    });

    if (!pat) return res.status(404).json({ error: "Not found" });
    res.status(200).json(pat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.pat_visit_by_hn = async (req, res) => {
  const { hn } = req.params;

  try {
    const pat_visit = await db.PatVisit.findAll({
      where: {
        [Op.or]: [{ hn: hn }],
        visitdatetime: {
          // [Op.gte]: oneYearAgo,
          [Op.gte]: elevenMonthAgo,
        },
      },
    })
    res.status(200).json(pat_visit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.pat_vitalsign_by_pat_visit = async (req, res) => {
  const { patvisitid } = req.params;
  try {
    const pat_vitalsign = await db.PatVitalSign.findAll({
      where: {
        [Op.or]: [{ patvisitid: patvisitid }],
        dodate: {
          // [Op.gte]: oneYearAgo,
          [Op.gte]: tenMonthAgo,
        },
      }
    });

    res.status(200).json(pat_vitalsign);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

