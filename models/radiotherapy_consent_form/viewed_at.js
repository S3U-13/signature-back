const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const ViewedAt = sequelize.define(
  "ViewedAt",
  {
    form_id: DataTypes.INTEGER,
    staff_viewed_at: {
      type: DataTypes.STRING(10),
    },
    nurse_viewed_at: {
      type: DataTypes.STRING(10),
    },
    doctor_viewed_at: {
      type: DataTypes.STRING(10),
    },
  },
  {
    modelName: "ViewedAt",
    tableName: "viewed_at",
  },
);
module.exports = ViewedAt;
