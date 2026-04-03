const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_user");

const UserSign = sequelize.define(
  "UserSign",
  {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // 🔥 สำคัญ
    },
    note: DataTypes.STRING,
    flag_type: DataTypes.STRING,
    flag_default: DataTypes.STRING,
    flag_cancel: DataTypes.STRING,
  },
  {
    modelName: "UserSign",
    tableName: "user_sign",
  },
);
module.exports = UserSign;
