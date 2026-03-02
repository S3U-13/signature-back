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
    createByUserId: DataTypes.INTEGER,
  },
  {
    modelName: "Form",
    tableName: "form",
  },
);

module.exports = Form;
