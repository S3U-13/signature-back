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
db.FormType = require("./form_type");
db.ChoiceType = require("./choice_type");
db.Choice = require("./choice");

//associations
// db.User.belongsTo(db.Role, { foreignKey: "role_id", as: "Role" });
// db.User.belongsTo(db.Position, { foreignKey: "position_id", as: "Position" });

db.Choice.belongsTo(db.ChoiceType, {
  foreignKey: "choice_type_id",
  as: "choice_type",
});

module.exports = db;
