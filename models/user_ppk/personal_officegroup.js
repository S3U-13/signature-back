const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const PersonalOfficeGroup = sequelize.define(
  "PersonalOfficeGroup",
  {
    offid: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    offname: DataTypes.STRING,
  },
  {
    modelName: "PersonalOfficeGroup",
    tableName: "personnal_officegroup",
    timestamps: false,
  },
);

module.exports = PersonalOfficeGroup;
