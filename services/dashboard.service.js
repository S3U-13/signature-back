const db = require("../models");
const { sequelize } = db;
const { Op, fn, col } = require("sequelize");

exports.getLast2MonthsStats = async () => {
  const now = new Date();

  const startDate = new Date();
  startDate.setMonth(now.getMonth() - 1);
  startDate.setDate(1);

  return await db.Form.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"],
      [fn("COUNT", col("id")), "total"],
      [
        fn(
          "SUM",
          sequelize.literal(
            `CASE WHEN form_status = 'Pending' AND flag_status = 'a' THEN 1 ELSE 0 END`,
          ),
        ),
        "pending",
      ],
      [
        fn(
          "SUM",
          sequelize.literal(
            `CASE WHEN form_status = 'Saved' AND flag_status = 'a' THEN 1 ELSE 0 END`,
          ),
        ),
        "saved",
      ],
      [
        fn(
          "SUM",
          sequelize.literal(
            `CASE WHEN form_status = 'Success' AND flag_status = 'a' THEN 1 ELSE 0 END`,
          ),
        ),
        "success",
      ],
      [
        fn(
          "SUM",
          sequelize.literal(`CASE WHEN flag_status = 'clg' THEN 1 ELSE 0 END`),
        ),
        "cancel",
      ],
    ],
    where: {
      createdAt: {
        [Op.gte]: startDate,
      },
    },
    group: ["month"],
    order: [[fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "ASC"]],
    raw: true,
  });
};

exports.monthlyQuery = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // ช่วงปีปัจจุบัน
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  return await db.Form.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"],
      [fn("COUNT", col("id")), "total"],
      [
        fn(
          "SUM",
          sequelize.literal(
            `CASE WHEN form_status = 'Success' AND flag_status = 'a' THEN 1 ELSE 0 END`,
          ),
        ),
        "success_total",
      ],
    ],
    where: {
      flag_status: "a",
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ["month"],
    order: [[fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "ASC"]],
    raw: true,
  });
};
