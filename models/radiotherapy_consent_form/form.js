const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Form = sequelize.define(
  "Form",
  {
    form_type_id: DataTypes.INTEGER,
    hn: DataTypes.INTEGER,
    visit_id: DataTypes.INTEGER,
    vitalsign_id: DataTypes.INTEGER,
    disease: DataTypes.STRING,
    lmp: DataTypes.DATE,
    consent: DataTypes.INTEGER,
    staff_id: DataTypes.INTEGER,
    nurse_id: DataTypes.INTEGER,
    doctor_userid: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    viewer: DataTypes.INTEGER,
    creator: DataTypes.INTEGER,
    form_status: DataTypes.STRING,
    flag_status: DataTypes.STRING,
    date_form: DataTypes.DATE,
  },
  {
    modelName: "Form",
    tableName: "form",
  },
);

module.exports = Form;
