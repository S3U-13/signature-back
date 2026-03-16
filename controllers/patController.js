const db = require("../models");
const { sequelize } = db;
const { Op } = require("sequelize");
// service

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
    return res.status(500).json({ error: error.message });
  }
};

exports.pat_visit_by_hn = async (req, res) => {
  const { hn } = req.params;
  const now = new Date();
  const elevenMonthAgo = new Date(now);
  elevenMonthAgo.setMonth(now.getMonth() - 11);
  try {
    const pat_visit = await db.PatVisit.findAll({
      where: {
        hn: hn,
        visitdatetime: {
          // [Op.gte]: oneYearAgo,
          [Op.gte]: elevenMonthAgo,
        },
      },
    });
    return res.status(200).json(pat_visit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.pat_vitalsign_by_pat_visit = async (req, res) => {
  const { patvisitid } = req.params;

  // const now = new Date();
  // const tenMonthAgo = new Date(now);
  // tenMonthAgo.setMonth(now.getMonth() - 10);

  try {
    if (!patvisitid) {
      return res.status(400).json({ message: "visitid is required" });
    }

    const pat_vitalsign = await db.PatVitalSign.findAll({
      where: {
        patvisitid: patvisitid,
        // dodate: {
        //   // [Op.gte]: oneYearAgo,
        //   [Op.gte]: tenMonthAgo,
        // },
      },
    });

    if (!pat_vitalsign.length) {
      return res.status(404).json({ message: "not found pat vitalsign" });
    }

    return res.status(200).json(pat_vitalsign);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.prename = async (req, res) => {
  try {
    const prename = await db.Lookup.findAll({
      where: {
        lookuptypeid: 17,
        active: "Y",
      },
    });
    return res.status(200).json(prename);
  } catch (error) {}
};

exports.relation = async (req, res) => {
  try {
    const relation = await db.Lookup.findAll({
      where: {
        lookuptypeid: 19,
        active: "Y",
      },
    });
    return res.status(200).json(relation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
