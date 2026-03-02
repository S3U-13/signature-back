const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FormType = sequelize.define(
  "form_type",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    form_name: DataTypes.STRING,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "FormType",
    tableName: "form_type",
  },
);

module.exports = FormType;
