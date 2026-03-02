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
db.OptionGroup = require("./option_group");
db.Option = require("./option");
db.Pat = require("./pat");

//associations
// db.User.belongsTo(db.Role, { foreignKey: "role_id", as: "Role" });
// db.User.belongsTo(db.Position, { foreignKey: "position_id", as: "Position" });

db.Option.belongsTo(db.OptionGroup, {
  foreignKey: "option_group_id",
  as: "OptionGroupName",
});

module.exports = db;
