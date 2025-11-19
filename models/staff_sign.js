const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StaffSign = sequelize.define(
  "StaffSign",
  {
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    staff_sign: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    staff_sign_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flag_status: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    modelName: "StaffSign",
    tableName: "staff_sign",
  }
);

module.exports = StaffSign;
