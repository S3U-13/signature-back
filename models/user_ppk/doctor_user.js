const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const DoctorUser = sequelize.define(
  "DoctorUser",
  {
    doctorid: { primaryKey: true, type: DataTypes.INTEGER },
    userid: DataTypes.INTEGER,
  },
  { modelName: "DoctorUser", tableName: "doctor_user", timestamps: false },
);

module.exports = DoctorUser;
