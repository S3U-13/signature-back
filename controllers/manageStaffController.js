const db = require("../models");
const { sequelize } = db;

exports.getManageStaff = async (req, res) => {
  try {
    const get_staffs = await db.ManageStaff.findAll({
      where: { flag_status: "a" },
    });

    let users = [];
    if (get_staffs) {
      for (const i of get_staffs) {
        const person = await db.AppPerson.findOne({
          attributes: ["id", "salutation", "firstname", "lastname", "PosID"],
          where: { id: i.personid },
          include: [
            {
              model: db.Lookup,
              as: "Salutation",
              attributes: ["lookupname"],
              where: { lookuptypeid: 17 },
            },
            { model: db.AppPosition, as: "Position" },
          ],
        });
        users.push({
          userid: i.userid,
          personid: i.personid,
          person_name: `${person.Salutation ? person.Salutation.lookupname : ""}${person.firstname} ${person.lastname}`,
          position: person.Position.Positionname ?? "",
        });
      }
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.addOrDeleteManageStaff = async (req, res) => {
  try {
    const { users_data, type } = req.body;

    if (!Array.isArray(users_data)) {
      return res.status(400).json({ message: "users_data must be array" });
    }

    if (!["add", "delete"].includes(type)) {
      return res.status(400).json({ message: "invalid type" });
    }

    if (type === "add") {
      for (const ud of users_data) {
        await db.ManageStaff.upsert({
          userid: ud.userid,
          personid: ud.personid,
        });
      }
    }

    if (type === "delete") {
      for (const ud of users_data) {
        await db.ManageStaff.destroy({
          where: {
            userid: ud.userid,
            personid: ud.personid,
          },
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Manage staff updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
