const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const DoctorName = sequelize.define(
  "DoctorName",
  {
    doctorid: { primaryKey: true, type: DataTypes.INTEGER },
    doctorname: DataTypes.STRING,
    doctorlastname: DataTypes.STRING,
    sex: DataTypes.STRING,
    doctorsalutation: DataTypes.STRING,
    doctorlicenseid: DataTypes.INTEGER,
    doctorspecialist: DataTypes.STRING,
    doctorlevel: DataTypes.STRING,
    doctordepart: DataTypes.STRING,
    doctorlimit: DataTypes.STRING,
    flag_active: DataTypes.STRING,
    personid: DataTypes.INTEGER,
    doctornameeng: DataTypes.STRING,
    doctorlastnameeng: DataTypes.STRING,
  },
  { modelName: "DoctorName", tableName: "doctor_name", timestamps: false },
);

module.exports = DoctorName;
