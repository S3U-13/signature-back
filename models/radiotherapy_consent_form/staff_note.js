const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const StaffNote = sequelize.define(
  "StaffNote",
  {
    form_id: DataTypes.INTEGER,
    cr: DataTypes.STRING,
    egfr: DataTypes.STRING,
    contrast_media: DataTypes.STRING,
    volume_cc: DataTypes.STRING,
    note: DataTypes.TEXT,
  },
  {
    modelName: "StaffNote",
    tableName: "staff_note",
  },
);

module.exports = StaffNote;
