const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PatSign = sequelize.define(
  "PatSign",
  {
    pat_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pat_sign: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    pat_sign_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flag_status: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "PatSign",
    tableName: "pat_sign",
  }
);

module.exports = PatSign;
