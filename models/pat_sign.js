const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PatSign = sequelize.define(
  "PatSign",
  {
    form_id: DataTypes.INTEGER,
    hn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    patient_sign: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    patient_sign_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flag_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    modelName: "PatSign",
    tableName: "pat_sign",
  },
);

module.exports = PatSign;
