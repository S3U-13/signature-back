const db = require("../models");
const { sequelize } = db;
const bcrypt = require("bcryptjs");
// const { logAction } = require("../services/logService");

exports.user_ppk = async (req, res) => {
  const { user_name } = req.params;
  try {
    const app_username = await db.AppUsername.findOne({
      where: { username: user_name },
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

    const name = doctor_data
      ? `${doctor_data?.doctorsalutation}${doctor_data?.doctorname} ${doctor_data?.doctorlastname}`
      : `${app_person?.Salutation?.lookupname}${app_person?.firstname} ${app_person?.lastname}`;

    const sex_doctor = doctor_data?.sex === "F" ? "หญิง" : "ชาย";

    const specialist = doctor_data ? doctor_data?.Specialist.descvalue : "";
    const level = doctor_data ? doctor_data?.Level.descvalue : "";
    const doctor_license = doctor_data ? doctor_data?.doctorlicenseid : "";

    const sex = doctor_data ? sex_doctor : app_person?.Sex;

    const user_data = {
      userid: app_username?.userid ?? null,
      username: app_username?.username ?? null,
      person_name: name,
      sex,
      doctor_license,
      GroID: app_person?.GroID ?? null,
      group: app_person?.Group?.groupname ?? null,
      PosID: app_person?.PosID ?? null,
      position: app_person?.Position?.Positionname ?? null,
      FuncunitID: app_person?.FuncUnitID ?? null,
      func_unit: app_person?.Funcunit?.FuncunitName ?? null,
      role,
      specialist,
      level,
      birthday: app_person?.Birthday ?? null,
    };

    return res.status(200).json({ user_data });
  } catch (error) {
    console.log(error); // 👈 สำคัญ
    return res.status(500).json({ message: error.message });
  }
};

// exports.position = async (req, res) => {
//   try {
//     const position = await db.Position.findAll();
//     res.json(position);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong!" });
//   }
// };

// exports.role = async (req, res) => {
//   try {
//     const role = await db.Role.findAll();
//     res.json(role);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong!" });
//   }
// };

// exports.index = async (req, res) => {
//   try {
//     const users = await db.User.findAll({
//       attributes: ["name", "user_name"],
//       include: [
//         { model: db.Role, as: "Role", attributes: ["role_name"] },
//         { model: db.Position, as: "Position", attributes: ["position_name"] },
//       ],
//     });
//     // await logAction({
//     //   userId: req.user.id,
//     //   action: "User index",
//     //   entity: "Auth",
//     //   entityId: req.user.id,
//     //   description: "เข้าดูข้อมูล User index",
//     //   req,
//     // });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong!" });
//   }
// };

// exports.view_by_id = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const users = await db.User.findOne({
//       where: { id },
//       include: [
//         { model: db.Role, as: "Role", attributes: ["role_name"] },
//         { model: db.Position, as: "Position", attributes: ["position_name"] },
//       ],
//     });
//     if (!users) {
//       return res.status(404).json({ error: "ไม่พบผู้ใช้นี้" });
//     }
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong!" });
//   }
// };

// exports.addUser = async (req, res) => {
//   try {
//     const {
//       name,
//       user_name,
//       password,
//       confirm_password,
//       role_id,
//       position_id,
//     } = req.body;

//     // ✅ 1. ตรวจว่ากรอกข้อมูลครบหรือไม่
//     if (
//       !name ||
//       !user_name ||
//       !password ||
//       !confirm_password ||
//       !role_id ||
//       !position_id
//     ) {
//       return res.status(400).json({
//         error:
//           "กรุณากรอกข้อมูลให้ครบถ้วน (name, user_name, password, confirm_password, role_id, position_id)",
//       });
//     }

//     // ✅ 2. ตรวจสอบรูปแบบ user_name
//     const usernameRegex = /^[A-Za-z0-9_.-]+$/;
//     if (!usernameRegex.test(user_name)) {
//       return res.status(400).json({
//         error: "ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น",
//       });
//     }

//     // ✅ 3. ตรวจสอบความยาวและรูปแบบ password
//     const passwordRegex = /^[A-Za-z0-9]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         error:
//           "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรและประกอบด้วยตัวเลขหรือตัวอักษรภาษาอังกฤษ",
//       });
//     }

//     // ✅ 4. ตรวจสอบว่ารหัสผ่านตรงกับ confirm_password หรือไม่
//     if (password !== confirm_password) {
//       return res.status(400).json({
//         error: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
//       });
//     }

//     // ✅ 5. ตรวจสอบ user_name ซ้ำในฐานข้อมูล
//     const existingUser = await db.User.findOne({ where: { user_name } });
//     if (existingUser) {
//       return res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
//     }

//     // ✅ 6. เข้ารหัสรหัสผ่าน
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ 7. สร้างผู้ใช้ใหม่
//     const user = await db.User.create({
//       name,
//       user_name,
//       password: hashedPassword,
//       role_id,
//       position_id,
//     });

//     // await logAction({
//     //   userId: req.user.id,
//     //   action: "Add User",
//     //   entity: "Auth",
//     //   entityId: req.user.id,
//     //   description: "เพิ่ม User",
//     //   req,
//     // });
//     // ✅ 8. ตอบกลับเมื่อสำเร็จ
//     res.status(201).json({
//       message: "สร้างบัญชีผู้ใช้สำเร็จ",
//       user: {
//         id: user.id,
//         name: user.name,
//         user_name: user.user_name,
//         role_id: user.role_id,
//         position_id: user.position_id,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่างในระบบ" });
//   }
// };
// exports.editUser = async (req, res) => {
//   try {
//     const { id } = req.params; // ดึง id จาก path เช่น /api/user/:id
//     const {
//       name,
//       user_name,
//       password,
//       confirm_password,
//       role_id,
//       position_id,
//     } = req.body;

//     // ✅ ตรวจว่ามี user ที่จะแก้ไขจริงหรือไม่
//     const user = await db.User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ error: "ไม่พบผู้ใช้งานนี้" });
//     }

//     // ✅ ตรวจสอบ user_name (ถ้ามีแก้)
//     if (user_name) {
//       const usernameRegex = /^[A-Za-z0-9_.-]+$/;
//       if (!usernameRegex.test(user_name)) {
//         return res.status(400).json({
//           error: "ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น",
//         });
//       }

//       // ห้ามใช้ user_name ซ้ำกับคนอื่น
//       const existingUser = await db.User.findOne({
//         where: { user_name, id: { [db.Sequelize.Op.ne]: id } },
//       });
//       if (existingUser) {
//         return res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
//       }
//     }

//     // ✅ ตรวจสอบ password (เฉพาะถ้ามีการเปลี่ยน)
//     let hashedPassword = user.password; // เก็บของเดิมไว้ก่อน
//     if (password || confirm_password) {
//       if (password !== confirm_password) {
//         return res
//           .status(400)
//           .json({ error: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน" });
//       }

//       const passwordRegex = /^[A-Za-z0-9]{8,}$/;
//       if (!passwordRegex.test(password)) {
//         return res.status(400).json({
//           error:
//             "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรและประกอบด้วยตัวเลขหรือตัวอักษรภาษาอังกฤษ",
//         });
//       }

//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     // ✅ อัปเดตข้อมูลผู้ใช้
//     await user.update({
//       name: name ?? user.name,
//       user_name: user_name ?? user.user_name,
//       password: hashedPassword,
//       role_id: role_id ?? user.role_id,
//       position_id: position_id ?? user.position_id,
//       updated_by: req.user.id,
//     });

//     // ✅ log การแก้ไข
//     // await logAction({
//     //   userId: req.user.id,
//     //   action: "Edit User",
//     //   entity: "Auth",
//     //   entityId: id,
//     //   description: `แก้ไขข้อมูลผู้ใช้ (ID: ${id})`,
//     //   req,
//     // });

//     res.json({
//       message: "แก้ไขข้อมูลผู้ใช้สำเร็จ",
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดบางอย่างในระบบ" });
//   }
// };
