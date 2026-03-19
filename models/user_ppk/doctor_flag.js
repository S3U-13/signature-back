const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const DoctorFlag = sequelize.define(
  "DoctorFlag",
  {
    tablename: { primaryKey: true, type: DataTypes.STRING },
    columnname: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    columnvalue: { primaryKey: true, type: DataTypes.STRING },
    descvalue: { type: DataTypes.STRING },
    note: DataTypes.STRING,
  },
  { modelName: "DoctorFlag", tableName: "doctor_flag", timestamps: false },
);

module.exports = DoctorFlag;
