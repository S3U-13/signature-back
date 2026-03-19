const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppUsername = sequelize.define(
  "AppUsername",
  {
    username: DataTypes.STRING,
    userid: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userdesc: DataTypes.STRING,
  },
  {
    modelName: "AppUserName",
    tableName: "app_username",
    timestamps: false,
  },
);

module.exports = AppUsername;
