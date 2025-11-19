const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Allergies = sequelize.define(
  "Allergies",
  {
    allergy: DataTypes.STRING(1),
    asthma: DataTypes.STRING(1),
    kidney_failure: DataTypes.STRING(1),
    diabetes: DataTypes.STRING(1),
    heart_disease: DataTypes.STRING(1),
    contrast_before: DataTypes.STRING(1),
    contrast_allergy: DataTypes.STRING(1),
    contrast_allergy_detail: DataTypes.STRING,
    seafood_allergy: DataTypes.STRING(1),
    seafood_allergy_detail: DataTypes.STRING,
    drug_allergy: DataTypes.STRING(1),
    drug_allergy_detail: DataTypes.STRING,
    lmp: DataTypes.DATE,
  },
  {
    modelName: "Allergies",
    tableName: "allergies",
  }
);

module.exports = Allergies;
