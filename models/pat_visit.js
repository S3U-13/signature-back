const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect_db_ppk");

const PatVisit = sequelize.define(
  "PatVisit",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    an: DataTypes.INTEGER,
    hn: DataTypes.INTEGER,
    visitdatetime: DataTypes.DATE,
    lastlocationid: DataTypes.INTEGER,
    ageday: DataTypes.INTEGER,
  },
  {
    tableName: "pat_visit",
    timestamps: false,
  },
);

module.exports = PatVisit;
