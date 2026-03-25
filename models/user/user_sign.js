const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_user");

const UserSign = sequelize.define(
  "UserSign",
  {
    userid: DataTypes.INTEGER,
    signature: DataTypes.BLOB,
    flag_status: DataTypes.STRING,
  },
  {
    modelName: "UserSign",
    tableName: "user_sign",
  },
);
module.exports = UserSign;
