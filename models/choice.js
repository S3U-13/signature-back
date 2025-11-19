const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Choice = sequelize.define(
  "choice",
  {
    choice_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    choice_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flag_active: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "Choice",
    tableName: "choice",
  }
);
module.exports = Choice;
