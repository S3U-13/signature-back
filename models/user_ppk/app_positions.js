const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppPosition = sequelize.define(
  "AppPosition",
  {
    PositionID: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    Positionname: DataTypes.STRING,
    PosID: DataTypes.INTEGER,
    PPK: DataTypes.INTEGER,
    Nurse: DataTypes.TINYINT,
    Shortname: DataTypes.STRING,
  },
  {
    modelName: "AppPosition",
    tableName: "app_positions",
  },
);

module.exports = AppPosition;
