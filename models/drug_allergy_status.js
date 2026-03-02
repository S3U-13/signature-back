const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DrugAllergyStatus = sequelize.define(
  "DrugAllergyStatus",
  {
    form_id: DataTypes.INTEGER,
    drug_allergy_id: DataTypes.INTEGER,
    drug: DataTypes.STRING,
  },
  {
    modelName: "DrugAllergyStatus",
    tableName: "drug_allergy_status",
  },
);

module.exports = DrugAllergyStatus;
