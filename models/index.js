const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import models
// db.User = require("./user");
// db.Role = require("./role");
// db.Position = require("./position");
// db.UserLog = require("./user_logs");

// choice
db.OptionGroup = require("./option_group");
db.Option = require("./option");

//form
db.FormType = require("./form_type");
db.Form = require("./form_type");
db.PatientContacts = require("./form_type");
db.CongenitalDisease = require("./form_type");
db.ContrastAllergyStatus = require("./form_type");
db.ContrastHistoryStatus = require("./form_type");
db.DrugAllergyStatus = require("./form_type");
db.PatSign = require("./form_type");
db.WitnessSign = require("./form_type");
db.StaffSign = require("./form_type");
db.DoctorSign = require("./form_type");

db.Pat = require("./pat");

//associations
// db.User.belongsTo(db.Role, { foreignKey: "role_id", as: "Role" });
// db.User.belongsTo(db.Position, { foreignKey: "position_id", as: "Position" });

// table options belongs to table option_groups by option_group_id as OptionGroupName
db.Option.belongsTo(db.OptionGroup, {
  foreignKey: "option_group_id",
  as: "OptionGroupName",
});

// form
db.FormType.hasMany(db.Form, {
  foreignKey: "form_type_id",
  as: "Form",
});

db.Form.belongsTo(db.FormType, {
  foreignKey: "form_type_id",
  as: "FormTypeName",
});

// hasOne
db.Form.hasOne(db.PatientContacts, {
  foreignKey: "form_id",
  as: "PatientContact",
});
db.Form.hasOne(db.CongenitalDisease, {
  foreignKey: "form_id",
  as: "CongenitalDis",
});
db.Form.hasOne(db.ContrastAllergyStatus, {
  foreignKey: "form_id",
  as: "ContrastAllergy",
});
db.Form.hasOne(db.ContrastHistoryStatus, {
  foreignKey: "form_id",
  as: "ContrastHistory",
});
db.Form.hasOne(db.DrugAllergyStatus, {
  foreignKey: "form_id",
  as: "DrugAllergy",
});
db.Form.hasOne(db.PatSign, {
  foreignKey: "form_id",
  as: "PatSigns",
});
db.Form.hasOne(db.WitnessSign, {
  foreignKey: "form_id",
  as: "WitnessSigns",
});
db.Form.hasOne(db.StaffSign, {
  foreignKey: "form_id",
  as: "StaffSigns",
});
db.Form.hasOne(db.DoctorSign, {
  foreignKey: "form_id",
  as: "DoctorSigns",
});

// belongsTo
db.PatientContacts.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.CongenitalDisease.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.ContrastAllergyStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.ContrastHistoryStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.DrugAllergyStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.PatSign.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.WitnessSign.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.StaffSign.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});
db.DoctorSign.belongsTo(db.Form, {
  foreignKey: "form_id",
  as: "FormService",
});

module.exports = db;
