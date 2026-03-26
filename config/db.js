// connect mysql db for models
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, // project_anc
  process.env.DB_USER, // root
  process.env.DB_PASS, // (ว่าง)
  {
    host: process.env.DB_HOST, // 127.0.0.1
    dialect: process.env.DB_DIALECT, // mysql
    port: process.env.PORT || 3306,
    logging: console.log, // ปิด log query
  },
);

module.exports = sequelize;
