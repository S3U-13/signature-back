const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Form = sequelize.define(
  "Form",
  {
    form_type_id: DataTypes.INTEGER,
    hn: DataTypes.INTEGER,
    disease: DataTypes.STRING,
    lmp: DataTypes.DATE,
    consent: DataTypes.INTEGER,
    staff_id: DataTypes.INTEGER,
    nurse_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    form_status: DataTypes.STRING,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "Form",
    tableName: "form",
  },
);

module.exports = Form;
