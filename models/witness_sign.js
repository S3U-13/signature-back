const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WitnessSign = sequelize.define(
  "WitnessSign",
  {
    witness_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    witness_sign: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    witness_sign_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flag_status: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "WitnessSign",
    tableName: "witness_sign",
  }
);

module.exports = WitnessSign;
