const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const NurseSign = sequelize.define(
  "NurseSign",
  {
    form_id: DataTypes.INTEGER,
    nurse_id: DataTypes.INTEGER,

    signature_id: DataTypes.INTEGER,

    flag_status: DataTypes.STRING,
  },
  {
    modelName: "NurseSign",
    tableName: "nurse_sign",
  },
);

module.exports = NurseSign;
