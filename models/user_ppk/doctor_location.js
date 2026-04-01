const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const DoctorLocation = sequelize.define(
  "DoctorLocation",
  {
    locationid: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    doctorid: DataTypes.INTEGER,
  },
  {
    modelName: "DoctorLocation",
    tableName: "doctor_location",
    timestamps: false,
  },
);

module.exports = DoctorLocation;
