const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PatientContact = sequelize.define(
  "PatientContact",
  {
    form_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    relation: DataTypes.STRING,
    flag_status: DataTypes.STRING,
  },
  { modelName: "PatientContact", tableName: "patient_contacts" },
);

module.exports = PatientContact;
