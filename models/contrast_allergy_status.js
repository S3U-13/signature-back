const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContrastAllergyStatus = sequelize.define(
  "ContrastAllergyStatus",
  {
    form_id: DataTypes.INTEGER,
    contrast_allergy_id: DataTypes.INTEGER,
    contrast_allergy_symptom: DataTypes.STRING,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "ContrastAllergyStatus",
    tableName: "contrast_allergy_status",
  },
);

module.exports = ContrastAllergyStatus;
