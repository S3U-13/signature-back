const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppUsername = sequelize.define(
  "AppUsername",
  {
    username: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    userdesc: DataTypes.STRING,
  },
  {
    modelName: "AppUserName",
    tableName: "app_username",
  },
);

module.exports = AppUsername;
