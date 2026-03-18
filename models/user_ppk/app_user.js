const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppUser = sequelize.define(
  "AppUser",
  {
    userid: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    blobpsw1: DataTypes.BLOB,
    blobpsw2: DataTypes.BLOB,
    rightlevel: DataTypes.INTEGER,
    careuserid: DataTypes.INTEGER,
    personid: DataTypes.INTEGER,
    startdatetime: DataTypes.DATE,
    enddatetime: DataTypes.DATE,
    createdatetime: DataTypes.DATE,
    createuserid: DataTypes.INTEGER,
    editdatetime: DataTypes.DATE,
    edituserid: DataTypes.INTEGER,
    editlogid: DataTypes.INTEGER,
    active: DataTypes.STRING,
  },
  {
    modelName: "AppUser",
    tableName: "app_user",
  },
);
module.exports = AppUser;
