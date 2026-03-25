const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_user");

const Username = sequelize.define(
  "Username",
  {
    userid: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password1: DataTypes.STRING,
    password2: DataTypes.STRING,
    active: DataTypes.STRING,
  },
  {
    modelName: "Username",
    tableName: "username",
  },
);
module.exports = Username;
