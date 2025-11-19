const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ChoiceType = sequelize.define(
  "ChoiceType",
  {
    id: {
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    type_name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    flag_active: {
      allowNull: true,
      type: DataTypes.STRING(1),
    },
  },
  {
    modelName: "ChoiceType",
    tableName: "choice_type",
  }
);
module.exports = ChoiceType;
