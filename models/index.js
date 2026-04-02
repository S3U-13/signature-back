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
db.FormType = require("./radiotherapy_consent_form/form_type");
db.Form = require("./radiotherapy_consent_form/form");
db.PatientContacts = require("./radiotherapy_consent_form/patient_contacts");
db.CongenitalDisease = require("./radiotherapy_consent_form/congenital_disease");
db.ContrastAllergyStatus = require("./radiotherapy_consent_form/contrast_allergy_status");
db.ContrastHistoryStatus = require("./radiotherapy_consent_form/contrast_history_status");
db.DrugAllergyStatus = require("./radiotherapy_consent_form/drug_allergy_status");
db.SeafoodAllergyStatus = require("./radiotherapy_consent_form/seafood_allergy_status");
db.PatSign = require("./radiotherapy_consent_form/pat_sign");
db.WitnessSign = require("./radiotherapy_consent_form/witness_sign");
db.StaffSign = require("./radiotherapy_consent_form/staff_sign");
db.DoctorSign = require("./radiotherapy_consent_form/doctor_sign");
db.NurseSign = require("./radiotherapy_consent_form/nurse_sign");
//manage staff
db.ManageStaff = require("./radiotherapy_consent_form/manage_staff");
//his
db.Pat = require("./his/pat");
db.PatVisit = require("./his/pat_visit");
db.Lookup = require("./his/lookup");
db.PatVitalSign = require("./his/pat_vitalsign");
// location ppk
db.Location = require("./location_ppk/location");
// user_ppk
db.AppUsername = require("./user_ppk/app_username");
db.AppUser = require("./user_ppk/app_user");
db.AppPerson = require("./user_ppk/app_person");
db.AppGroup = require("./user_ppk/app_group");
db.AppPosition = require("./user_ppk/app_positions");
db.AppPersonFunctionalUnit = require("./user_ppk/app_personfunctionalunit");
db.DoctorLocation = require("./user_ppk/doctor_location");
db.DoctorName = require("./user_ppk/doctor_name");
db.DoctorUser = require("./user_ppk/doctor_user");
db.DoctorFlag = require("./user_ppk/doctor_flag");
db.PersonalOfficeGroup = require("./user_ppk/personal_officegroup");
db.AppDataGroup = require("./user_ppk/app_usergroup");
db.AppDataSetGroup = require("./user_ppk/app_datasetgroup");
//user
db.Username = require("./user/user_name");
db.UserSign = require("./user/user_sign");
db.UserSignData = require("./user/user_sign_data");
db.DoctorImage = require("./user/doctor_image");
db.DoctorImageData = require("./user/doctor_imagedata");

// associations
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
db.Form.hasOne(db.NurseSign, {
  foreignKey: "form_id",
  as: "NurseSigns",
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

db.NurseSign.belongsTo(db.Form, {
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

// ============================== user join =================================//

// user -> username
db.AppUser.hasOne(db.AppUsername, { foreignKey: "userid", as: "Username" });
// user -> app_person
db.AppPerson.hasOne(db.AppUser, { foreignKey: "personid" });
// app_group -> app_person
// db.AppGroup.hasMany(db.AppPerson, {
//   foreignKey: "GroID",
//   as: "Group",
// });

// // app_positions -> app_person
// db.AppPosition.hasMany(db.AppPerson, {
//   foreignKey: "PosID",
//   as: "Position",
// });

// // funcunit -> app_person
// db.AppPersonFunctionalUnit.hasMany(db.AppPerson, {
//   foreignKey: "FuncUnitID",
//   as: "Funcunit",
// });

// // lookup -> app_person
// db.Lookup.hasMany(db.AppPerson, {
//   foreignKey: "salutation",
//   as: "Salutation",
// });
// username -> user
db.AppUsername.belongsTo(db.AppUser, { foreignKey: "userid" });
// app_person -> user
db.AppUser.belongsTo(db.AppPerson, { foreignKey: "personid", as: "Person" });
// app_person <-> app_group
db.AppPerson.belongsTo(db.AppGroup, { foreignKey: "GroID", as: "Group" });
// app_person <-> app_positions
db.AppPerson.belongsTo(db.AppPosition, {
  foreignKey: "PosID",
  as: "Position",
  targetKey: "PosID",
});
db.AppPerson.belongsTo(db.PersonalOfficeGroup, {
  foreignKey: "OffID",
  as: "Office",
  targetKey: "offid",
});
// app_person <-> app_personfuctionalunit
db.AppPerson.belongsTo(db.AppPersonFunctionalUnit, {
  foreignKey: "FuncUnitID",
  as: "Funcunit",
});
// app_person <-> lookup
db.AppPerson.belongsTo(db.Lookup, {
  foreignKey: "salutation",
  as: "Salutation",
});

db.DoctorName.belongsTo(db.DoctorFlag, {
  foreignKey: "doctorspecialist",
  as: "Specialist",
  targetKey: "columnvalue",
});

db.DoctorName.belongsTo(db.DoctorFlag, {
  foreignKey: "doctorlevel",
  as: "Level",
  targetKey: "columnvalue",
});

db.DoctorLocation.belongsTo(db.DoctorName, {
  foreignKey: "doctorid",
  as: "Doctor",
});

db.AppDataGroup.hasMany(db.AppDataSetGroup, {
  foreignKey: "groupid",
  as: "SetGroup",
});

db.AppDataSetGroup.belongsTo(db.AppDataGroup, {
  foreignKey: "groupid",
  as: "SetGroup",
});

db.AppDataSetGroup.belongsTo(db.Location, {
  foreignKey: "referenceid",
  as: "LocationSetGroup",
});

// create signature
db.UserSignData.belongsTo(db.UserSign, {
  foreignKey: "id",
  as: "SignData",
});

db.DoctorImageData.belongsTo(db.DoctorImage, {
  foreignKey: "id",
  as: "DoctorSignData",
});

module.exports = db;
