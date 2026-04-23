const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Pdf = sequelize.define(
  "Pdf",
  {
    form_id: {
      type: DataTypes.INTEGER, // 🔥 แก้จาก STRING → INTEGER
      allowNull: false,
    },

    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ❌ ไม่ใช้แล้ว (ถ้าเก็บ blob)
    // file_url: {
    //   type: DataTypes.STRING,
    // },

    // ✅ เก็บไฟล์จริง
    file_data: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },

    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    mime_type: {
      type: DataTypes.STRING,
      defaultValue: "application/pdf",
    },

    // ref_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },

    // ref_type: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },

    checksum: {
      type: DataTypes.STRING, // 🔥 ใช้ cache
    },
    version: {
      type: DataTypes.INTEGER, // 🔥 versioning
      defaultValue: 1,
    },
    storage_type: {
      type: DataTypes.STRING, // "blob" | "file"
      defaultValue: "blob",
    },
    // file_path: {
    //   type: DataTypes.STRING, // fallback เก็บ file
    // }, เอาออก

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
    timestamps: true, // ใช้ createdAt, updatedAt
  },
);

module.exports = Pdf;
