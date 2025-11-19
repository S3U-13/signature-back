const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DoctorSign = sequelize.define(
  "DoctorSign",
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    doctor_sign: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    doctor_sign_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flag_status: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "DoctorSign",
    tableName: "doctor_sign",
  }
);

module.exports = DoctorSign;
