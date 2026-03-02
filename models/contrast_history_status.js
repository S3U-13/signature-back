const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContrastHistoryStatus = sequelize.define(
  "ContrastHistoryStatus",
  {
    form_id: DataTypes.INTEGER,
    contrast_history_id: DataTypes.INTEGER,
  },
  {
    modelName: "ContrastHistoryStatus",
    tableName: "contrast_history_status",
  },
);

module.exports = ContrastHistoryStatus;
