const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SeafoodAllergyStatus = sequelize.define(
  "SeafoodAllergyStatus",
  {
    form_id: DataTypes.INTEGER,
    seafood_allergy_id: DataTypes.INTEGER,
    seafood_allergy_symptom: DataTypes.STRING,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "SeafoodAllergyStatus",
    tableName: "seafood_allergy_status",
  },
);

module.exports = SeafoodAllergyStatus;
