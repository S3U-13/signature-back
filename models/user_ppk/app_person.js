const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect_db_ppk");

const AppPerson = sequelize.define(
  "AppPerson",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    PSCodeID: DataTypes.INTEGER,
    pscode: DataTypes.STRING,
    salutation: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    GroID: DataTypes.INTEGER,
    OffID: DataTypes.INTEGER,
    PosID: DataTypes.INTEGER,
    NursePosID: DataTypes.INTEGER,
    Poslevel: DataTypes.STRING,
    Sex: DataTypes.STRING,
    DivID: DataTypes.INTEGER,
    DepartID: DataTypes.INTEGER,
    SsjID: DataTypes.INTEGER,
    WorkPoint: DataTypes.STRING,
    Educate: DataTypes.STRING,
    Birthday: DataTypes.DATE,
    Remark: DataTypes.STRING,
    Active: DataTypes.STRING,
    FuncUnitID: DataTypes.INTEGER,
    StatusID: DataTypes.INTEGER,
    CITIZEN: DataTypes.STRING,
    EndUser: DataTypes.INTEGER,
    Engprename: DataTypes.STRING,
    Engname: DataTypes.STRING,
    Engusername: DataTypes.STRING,
    HN: DataTypes.INTEGER,
  },
  { modelName: "AppPerson", tableName: "app_person" },
);

module.exports = AppPerson;
