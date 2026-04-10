const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const NurseSign = sequelize.define(
  "NurseSign",
  {
    form_id: DataTypes.INTEGER,
    nurse_id: DataTypes.INTEGER,
    nurse_sign: DataTypes.BLOB,
    signature_id: DataTypes.INTEGER,
    nurse_sign_date: DataTypes.DATE,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "NurseSign",
    tableName: "nurse_sign",
  },
);

module.exports = NurseSign;
