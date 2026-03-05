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
db.Form = require("./form");
db.PatientContacts = require("./patient_contacts");
db.CongenitalDisease = require("./congenital_disease");
db.ContrastAllergyStatus = require("./contrast_allergy_status");
db.ContrastHistoryStatus = require("./contrast_history_status");
db.DrugAllergyStatus = require("./drug_allergy_status");
db.SeafoodAllergyStatus = require("./seafood_allergy_status");
db.PatSign = require("./pat_sign");
db.WitnessSign = require("./witness_sign");
db.StaffSign = require("./staff_sign");
db.DoctorSign = require("./doctor_sign");

db.Pat = require("./pat");
db.PatVisit = require("./pat_visit");
db.Lookup = require("./lookup");
db.PatVitalSign = require("./pat_vitalsign");

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
db.Form.hasOne(db.SeafoodAllergyStatus, {
  foreignKey: "form_id",
  as: "SeafoodAllergy",
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
});

db.CongenitalDisease.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.ContrastAllergyStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.ContrastHistoryStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.DrugAllergyStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.SeafoodAllergyStatus.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.PatSign.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.WitnessSign.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.StaffSign.belongsTo(db.Form, {
  foreignKey: "form_id",
});

db.DoctorSign.belongsTo(db.Form, {
  foreignKey: "form_id",
});

// pat

db.Pat.belongsTo(db.Lookup, {
  foreignKey: "occupation",
  targetKey: "lookupid",
  as: "occupation_detail",
});

db.Pat.belongsTo(db.Lookup, {
  foreignKey: "sex",
  targetKey: "lookupid",
  as: "sex_name",
});

db.Pat.belongsTo(db.Lookup, {
  foreignKey: "race",
  targetKey: "lookupid",
  as: "race_text",
});

db.Pat.belongsTo(db.Lookup, {
  foreignKey: "citizenship",
  targetKey: "lookupid",
  as: "citizenship_text",
});

// pat_visit -> pat
db.Pat.hasMany(db.PatVisit, { foreignKey: "hn", as: "pat_visit" });

// 📌 Pat ↔ PatVitalSign (1:N)
db.Pat.hasMany(db.PatVitalSign, { foreignKey: "hn", as: "pat_vitalsign" });
db.PatVitalSign.belongsTo(db.Pat, { foreignKey: "hn", as: "pat_vitalsign" });

module.exports = db;
