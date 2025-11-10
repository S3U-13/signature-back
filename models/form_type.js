const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FormType = sequelize.define(
  "form_type",
  {
    code: {
      type: DataTypes.STRING(5),
      primaryKey: true,
    },
    form_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    flag_active: {
      allowNull: false,
      defaultValue: "y",
      type: DataTypes.STRING(1),
    },
  },
  {
    tableName: "form_type",
  }
);

// สร้าง id อัตโนมัติ F0001, F0002 ...
FormType.beforeCreate(async (form) => {
  const lastForm = await FormType.findOne({
    order: [["code", "DESC"]],
  });

  if (!lastForm) {
    form.code = "F0001";
  } else {
    const lastIdNum = parseInt(lastForm.code.slice(1), 10);
    const newIdNum = lastIdNum + 1;
    form.code = "F" + newIdNum.toString().padStart(4, "0");
  }
});

module.exports = FormType;
