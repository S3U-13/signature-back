const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppGroup = sequelize.define(
  "AppGroup",
  {
    id: DataTypes.INTEGER,
    groupname: DataTypes.STRING,
    active: DataTypes.STRING,
    edituserid: DataTypes.INTEGER,
    userlogid: INTEGER,
  },
  {
    modelName: "AppGroup",
    tableName: "app_group",
  },
);

module.exports = AppGroup;
