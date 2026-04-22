const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Pdf = sequelize.define(
  "Pdf",
  {
    form_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mime_type: {
      type: DataTypes.STRING,
      defaultValue: "application/pdf",
    },
    ref_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ref_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  },
  {
    tableName: "pdf",
    modelName: "Pdf",
  },
);

module.exports = Pdf;
