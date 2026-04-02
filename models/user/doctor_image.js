const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_user");

const DoctorImage = sequelize.define(
  "DoctorImage",
  {
    doctorid: DataTypes.INTEGER,
    note: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    editdatetime: DataTypes.DATE,
    flag_type: DataTypes.STRING,
    flag_default: DataTypes.STRING,
    flag_cancel: DataTypes.STRING,
  },
  {
    modelName: "DoctorImage",
    tableName: "doctor_image",
    timestamps: false,
  },
);

module.exports = DoctorImage;
