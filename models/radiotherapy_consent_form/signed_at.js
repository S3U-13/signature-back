const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const SignedAt = sequelize.define(
  "SignedAt",
  {
    form_id: DataTypes.INTEGER,
    staff_signed_at: {
      type: DataTypes.STRING(10),
    },
    nurse_signed_at: {
      type: DataTypes.STRING(10),
    },
    doctor_signed_at: {
      type: DataTypes.STRING(10),
    },
  },
  {
    modelName: "SignedAt",
    tableName: "signed_at",
  },
);
module.exports = SignedAt;
