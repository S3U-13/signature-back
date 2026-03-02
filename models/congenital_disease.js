const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CongenitalDisease = sequelize.define(
  "CongenitalDisease",
  {
    form_id: DataTypes.INTEGER,
    condition_id: DataTypes.INTEGER,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "CongenitalDisease",
    tableName: "congenital_disease",
  },
);

module.exports = CongenitalDisease;
