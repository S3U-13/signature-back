const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ManageStaff = sequelize.define(
  "ManageStaff",
  {
    userid: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    personid: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    locationid: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    flag_status: {
      allowNull: true,
      defaultValue: "a",
      type: DataTypes.STRING(10),
    },
  },
  {
    modelName: "ManageStaff",
    tableName: "manage_staff",
  },
);

module.exports = ManageStaff;
