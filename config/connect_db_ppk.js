// connect mysql db for models
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DBPPK_NAME, // project_anc
  process.env.DBPPK_USER, // root
  process.env.DBPPK_PASS, // (ว่าง)
  {
    host: process.env.DBPPK_HOST, // 127.0.0.1
    dialect: process.env.DBPPK_DIALECT, // mysql
    port: process.env.PORTPPK || 3306,
    logging: false, // ปิด log query
  }
);

module.exports = sequelize;
