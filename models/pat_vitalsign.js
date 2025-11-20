const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect_db_ppk");

const PatVitalSign = sequelize.define(
  "PatVitalSign",
  {
    id: DataTypes.INTEGER,
    patregid: DataTypes.INTEGER,
    patvisitid: DataTypes.INTEGER,
    hn: DataTypes.INTEGER,
    dodate: DataTypes.DATE,
    dotime: DataTypes.TIME,
    weight: DataTypes.DECIMAL,
  },
  {
    modelName: "PatVitalSign",
    tableName: "patvitalsign",
    timestamps: false,
  }
);
module.exports = PatVitalSign;
