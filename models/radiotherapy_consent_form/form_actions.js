const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const FormAction = sequelize.define(
  "FormAction",
  {
    form_id: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    doctorid: DataTypes.INTEGER,
    role: DataTypes.STRING,
    status: DataTypes.STRING(20),
    viewed_at: DataTypes.DATE,
    signed_at: DataTypes.DATE,
    lock: DataTypes.STRING,
  },
  {
    modelName: "FormAction",
    tableName: "form_actions",
    timestamps: false,
  },
);

module.exports = FormAction;
