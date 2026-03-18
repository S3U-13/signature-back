const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppPersonFunctionalUnit = sequelize.define(
  "AppPersonFunctionalUnit",
  {
    FuncunitID: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    FuncunitName: DataTypes.STRING,
    TyCode: DataTypes.STRING,
    DepartID: DataTypes.INTEGER,
    SublocID: DataTypes.INTEGER,
    Desce: DataTypes.STRING,
    FunctCode: DataTypes.TINYINT,
    Serviceflag: DataTypes.STRING,
  },
  {
    modelName: "AppPersonFunctionalUnit",
    tableName: "app_personfunctinalunit",
  },
);

module.exports = AppPersonFunctionalUnit;
