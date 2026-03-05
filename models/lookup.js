const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect_db_ppk");

const Lookup = sequelize.define(
  "Lookup",
  {
    lookuptypeid: DataTypes.INTEGER,
    lookupid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lookupname: DataTypes.STRING,
  },
  {
    tableName: "lookup",
    timestamps: false,
  },
);

module.exports = Lookup;
