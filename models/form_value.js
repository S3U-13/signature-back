const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const FormValue = sequelize.define(
  "FormValue",
  {
    form_type_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    hn: DataTypes.INTEGER,
    pat_sign_id: DataTypes.INTEGER,
    witness_sign_id: DataTypes.INTEGER,
    staff_sign_id: DataTypes.INTEGER,
    doctor_sign_id: DataTypes.INTEGER,
    allergy_id: DataTypes.INTEGER,
    relation: DataTypes.STRING,
    disease: DataTypes.STRING,
    consent: DataTypes.STRING(1),
    createByUserId: DataTypes.INTEGER,
  },
  {
    modelName: "FormValue",
    tableName: "form_value",
  }
);

module.exports = FormValue;
