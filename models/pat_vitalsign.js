const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect_db_ppk");

const PatVitalSign = sequelize.define(
  "PatVitalSign",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patregid: DataTypes.INTEGER,
    patvisitid: DataTypes.INTEGER,
    hn: DataTypes.INTEGER,
    dodate: DataTypes.DATE,
    dotime: DataTypes.TIME,
    weight: DataTypes.DECIMAL,
  },
  {
    modelName: "PatVitalSign",
    tableName: "pat_vitalsign",
    timestamps: false,
  },
);
module.exports = PatVitalSign;
