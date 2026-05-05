const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const DoctorSign = sequelize.define(
  "DoctorSign",
  {
    form_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    signature_id: DataTypes.INTEGER,

    flag_status: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "DoctorSign",
    tableName: "doctor_sign",
  },
);

module.exports = DoctorSign;
