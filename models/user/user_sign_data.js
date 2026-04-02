const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_user");

const UserSignData = sequelize.define(
  "UserSignData",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    signature: DataTypes.STRING,
  },
  {
    modelName: "UserSignData",
    tableName: "user_sign_data",
    timestamps: false,
  },
);

module.exports = UserSignData;
