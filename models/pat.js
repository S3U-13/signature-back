const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect_db_ppk");
const Pat = sequelize.define(
  "Pat",
  {
    hn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    citizencardno: DataTypes.STRING(13),
    salutation: DataTypes.INTEGER,
    prename: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    sex: DataTypes.INTEGER,
    race: DataTypes.INTEGER,
    birthdatetime: DataTypes.DATE,
  },
  {
    modelName: "Pat",
    tableName: "pat",
    timestamps: false,
  }
);

module.exports = Pat;
