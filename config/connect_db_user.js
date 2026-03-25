// connect mysql db for models
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DBUSER_NAME, // project_anc
  process.env.DBUSER_USER, // root
  process.env.DBUSER_PASS, // (ว่าง)
  {
    host: process.env.DBUSER_HOST, // 127.0.0.1
    dialect: process.env.DBUSER_DIALECT, // mysql
    port: process.env.DBUSER_PORT || 3306,
    logging: true, // ปิด log query
  },
);

module.exports = sequelize;
