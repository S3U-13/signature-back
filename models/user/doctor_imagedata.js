const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_user");

const DoctorImageData = sequelize.define(
  "DoctorImageData",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    imagedata: DataTypes.STRING,
  },
  {
    modelName: "DoctorImageData",
    tableName: "doctor_imagedata",
    timestamps: false,
  },
);

module.exports = DoctorImageData;
