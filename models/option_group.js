const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OptionGroup = sequelize.define(
  "OptionGroup",
  {
    id: {
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    flag_active: {
      allowNull: true,
      type: DataTypes.STRING(1),
    },
  },
  {
    modelName: "OptionGroup",
    tableName: "option_groups",
  },
);
module.exports = OptionGroup;
