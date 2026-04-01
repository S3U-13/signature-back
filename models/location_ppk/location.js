const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const Location = sequelize.define(
  "location",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    detailtext: DataTypes.STRING,
    locationtypeid: DataTypes.INTEGER,
    departmentid: DataTypes.INTEGER,
    buildingid: DataTypes.INTEGER,
    floor: DataTypes.INTEGER,
    active: DataTypes.STRING,
    progno: DataTypes.INTEGER,
    shortkey: DataTypes.STRING,
    locationconsultid: DataTypes.INTEGER,
    shortname: DataTypes.STRING,
    telephone: DataTypes.STRING,
    flag_1: DataTypes.STRING,
  },
  {
    modelName: "Location",
    tableName: "location",
    timestamps: false,
  },
);
module.exports = Location;
