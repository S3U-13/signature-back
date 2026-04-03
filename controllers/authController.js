const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = require("../utils/hashPassword");

require("dotenv").config();
const defaultPassword = process.env.DEFAULT_PASSWORD;
// const { logAction } = require("../services/logService");

exports.register_by_cid = async (req, res) => {
  try {
    const { cid } = req.body;

    const requiredFields = ["cid"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    const app_person = await db.AppPerson.findOne({
      attributes: ["id", "CITIZEN"],
      where: {
        CITIZEN: cid,
      },
    });

    if (!app_person) {
      return res
        .status(404)
        .json({ message: "Not found Person กรุณาติดต่อเจ้าหน้าที่ !!" });
    }

    const app_user = app_person.id
      ? await db.AppUser.findOne({
          attributes: ["userid", "personid"],
          where: { personid: app_person.id },
        })
      : null;

    if (!app_user) {
      return res
        .status(404)
        .json({ message: "ไม่พบ username กรุณาติดต่อเจ้าหน้าที่ !!" });
    }

    const app_username = app_user.userid
      ? await db.AppUsername.findOne({
          attributes: ["username", "userid"],
          where: {
            userid: app_user.userid,
          },
        })
      : null;

    if (app_username && app_username.username) {
      const hashedPassword = await hashPassword(defaultPassword);
      await db.Username.create({
        userid: app_username.userid,
        username: app_username.username,
        password1: hashedPassword,
        password2: hashedPassword,
      });
    }
    return res.status(200).json({ message: "User ppk is activated" });
  } catch (error) {
    console.log(error); // 👈 สำคัญ
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.Username.findOne({
      where: { username },
    });

    const app_username = await db.AppUsername.findOne({
      where: { username: user.username },
    });

    if (!app_username) {
      return res.status(404).json({ message: "ไม่เจอ username" });
    }

    const app_user = await db.AppUser.findOne({
      where: { userid: app_username.userid },
    });

    if (!app_user) {
      return res.status(404).json({ message: "ไม่เจอ app_user" });
    }

    const app_person = await db.AppPerson.findOne({
      where: { id: app_user.personid },
      include: [
        { model: db.Lookup, as: "Salutation", where: { lookuptypeid: 17 } },
        { model: db.AppGroup, as: "Group" },
        { model: db.AppPosition, as: "Position" },
        { model: db.PersonalOfficeGroup, as: "Office" },
        { model: db.AppPersonFunctionalUnit, as: "Funcunit" },
      ],
    });

    let doctor_data = null;
    let role = null;
    if ([61502, 61523, 61525].includes(app_person?.PosID)) {
      role = "nurse";
    } else if ([60104, 60204, 60501, 82923].includes(app_person?.PosID)) {
      doctor_data = await db.DoctorName.findOne({
        where: { personid: app_person.id },
        include: [
          {
            model: db.DoctorFlag,
            as: "Specialist",
            where: { columnname: "doctorspecialist" },
          },
          {
            model: db.DoctorFlag,
            as: "Level",
            where: { columnname: "doctorlevel" },
          },
        ],
      });
      role = "doctor";
    } else {
      role = "staff";
    }

    const doctorid = role === "doctor" ? doctor_data?.doctorid || null : null;

    const user_data = {
      doctorid,
      userid: app_username?.userid ?? null,
      username: app_username?.username ?? null,
      role,
    };
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password1);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      {
        id: user.id,
        userid: user.userid,
        username: user.username,
        role,
        doctorid, // 🔥 ใช้ตัวเดียวกัน
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 60 * 60 * 1000,
      // secure: true, // เปิดเมื่อใช้ https
    });

    // บันทึก log
    // await logAction({
    //   userId: user.id,
    //   action: "login",
    //   entity: "Auth",
    //   entityId: user.id,
    //   description: "ผู้ใช้เข้าสู่ระบบ",
    //   req,
    // });

    res.json({
      message: "Login success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong or Server error" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies?.access_token; // 👈 เปลี่ยนตรงนี้

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    // 🔥 decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const user = await db.Username.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const app_username = await db.AppUsername.findOne({
      where: { username: user.username },
    });

    if (!app_username) {
      return res.status(404).json({ message: "ไม่เจอ username" });
    }

    const app_user = await db.AppUser.findOne({
      where: { userid: app_username.userid },
    });

    if (!app_user) {
      return res.status(404).json({ message: "ไม่เจอ app_user" });
    }

    const app_person = await db.AppPerson.findOne({
      where: { id: app_user.personid },
      include: [
        {
          model: db.Lookup,
          as: "Salutation",
          required: false,
          where: { lookuptypeid: 17 },
        },
        { model: db.AppGroup, as: "Group", required: false },
        { model: db.AppPosition, as: "Position", required: false },
        { model: db.PersonalOfficeGroup, as: "Office", required: false },
        { model: db.AppPersonFunctionalUnit, as: "Funcunit", required: false },
      ],
    });

    if (!app_person) {
      return res.status(404).json({ message: "ไม่เจอ person" });
    }

    // 🔥 role
    let doctor_data = null;
    let role = "staff";

    if ([61502, 61523, 61525].includes(app_person.PosID)) {
      role = "nurse";
    } else if ([60104, 60204, 60501, 82923].includes(app_person.PosID)) {
      doctor_data = await db.DoctorName.findOne({
        where: { personid: app_person.id },
        include: [
          {
            model: db.DoctorFlag,
            as: "Specialist",
            where: { columnname: "doctorspecialist" },
            required: false,
          },
          {
            model: db.DoctorFlag,
            as: "Level",
            where: { columnname: "doctorlevel" },
            required: false,
          },
        ],
      });
      role = "doctor";
    }

    const name = doctor_data
      ? `${doctor_data?.doctorsalutation}${doctor_data?.doctorname} ${doctor_data?.doctorlastname}`
      : `${app_person?.Salutation?.lookupname}${app_person?.firstname} ${app_person?.lastname}`;

    const sex_doctor = doctor_data?.sex === "F" ? "หญิง" : "ชาย";

    const specialist = doctor_data ? doctor_data?.Specialist.descvalue : "";
    const level = doctor_data ? doctor_data?.Level.descvalue : "";
    const doctor_license = doctor_data ? doctor_data?.doctorlicenseid : "";

    const sex = doctor_data ? sex_doctor : app_person?.Sex;

    const doctorid = doctor_data?.doctorid ?? null;

    const user_data = {
      doctorid,
      userid: app_username?.userid ?? null,
      username: app_username?.username ?? null,
      person_name: name,
      sex,
      doctor_license,
      GroID: app_person?.GroID ?? null,
      group: app_person?.Group?.groupname ?? null,
      PosID: app_person?.PosID ?? null,
      position: app_person?.Position?.Positionname ?? null,
      OffID: app_person?.OffID ?? null,
      office: app_person?.Office?.offname ?? null,
      FuncunitID: app_person?.FuncUnitID ?? null,
      func_unit: app_person?.Funcunit?.FuncunitName ?? null,
      role,
      specialist,
      level,
      birthday: app_person?.Birthday ?? null,
    };

    return res.json({
      message: "success",
      user_data,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.checkToken = (req, res) => {
  const token = req.cookies?.access_token; // 👈 เปลี่ยนตรงนี้
  if (!token) return res.status(401).json({ valid: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // token หมดอายุหรือไม่ถูกต้อง
      return res.status(401).json({ valid: false, error: err.message });
    }
    // token valid
    res.json({ valid: true, user: decoded });
  });
};
