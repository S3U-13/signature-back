const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppDatasetGroup = sequelize.define(
  "AppDatasetGroup",
  {
    groupid: { primaryKey: true, type: DataTypes.INTEGER },
    referencename: DataTypes.STRING,
    referenceid: DataTypes.INTEGER,
    rightflag: DataTypes.STRING,
  },
  {
    modelName: "AppDatasetGroup",
    tableName: "app_datasetgroup",
    timestamps: false,
  },
);
module.exports = AppDatasetGroup;
