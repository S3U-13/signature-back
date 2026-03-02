const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Option = sequelize.define(
  "Option",
  {
    option_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flag_active: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "Option",
    tableName: "option",
  },
);
module.exports = Option;
