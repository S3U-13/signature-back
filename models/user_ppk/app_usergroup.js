const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppUserGroup = sequelize.define(
  "AppUserGroup",
  {
    groupid: DataTypes.INTEGER,
    userid: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    active: DataTypes.STRING,
    createdatetime: DataTypes.DATE,
  },
  {
    modelName: "AppUserGroup",
    tableName: "app_usergroup",
    timestamps: false,
  },
);
module.exports = AppUserGroup;
