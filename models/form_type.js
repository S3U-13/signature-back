const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FormType = sequelize.define(
  "form_type",
  {
    form_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    flag_status: {
      allowNull: true,
      type: DataTypes.STRING(1),
    },
  },
  {
    modelName: "FormType",
    tableName: "form_type",
  },
);

module.exports = FormType;
