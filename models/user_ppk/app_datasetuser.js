const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppDatasetUser = sequelize.define(
  "AppDatasetUser",
  {
    userid: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    referencename: DataTypes.STRING,
    referenceid: DataTypes.INTEGER,
    rightflag: DataTypes.STRING,
  },
  {
    modelName: "AppDatasetUser",
    tableName: "app_datasetuser",
    timestamps: false,
  },
);
module.exports = AppDatasetUser;
