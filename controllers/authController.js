// const db = require("../models");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { logAction } = require("../services/logService");

// exports.login = async (req, res) => {
//   try {
//     const { user_name, password } = req.body;

//     const user = await db.User.findOne({
//       where: { user_name },
//       include: [
//         { model: db.Role, as: "Role", attributes: ["role_name"] },
//         { model: db.Position, as: "Position", attributes: ["position_name"] },
//       ],
//     });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ error: "Invalid password" });

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role_id: user.role_id,
//       },
//       process.env.JWT_SECRET || "secretkey",
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     // บันทึก log
//     await logAction({
//       userId: user.id,
//       action: "login",
//       entity: "Auth",
//       entityId: user.id,
//       description: "ผู้ใช้เข้าสู่ระบบ",
//       req,
//     });

//     res.json({
//       message: "Login success",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         role_id: user.role_id,
//         position_id: user.position_id,
//         position_name: user.Position?.position_name || null,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong or Server error" });
//   }
// };

// exports.logout = async (req, res) => {
//   try {
//     console.log("🟢 Logout request received");

//     if (req.user) {
//       console.log("👤 Logout user:", req.user.id);

//       await logAction({
//         userId: req.user.id,
//         action: "logout",
//         entity: "Auth",
//         entityId: req.user.id,
//         description: "ผู้ใช้ออกจากระบบ",
//         req,
//       });
//     } else {
//       console.log(
//         "⚠️ req.user ไม่มีค่า (token อาจไม่ถูกส่งหรือ decode ไม่ได้)"
//       );
//     }

//     res.json({ message: "Logout success" });
//   } catch (err) {
//     console.error("❌ Logout error:", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

// exports.checkToken = (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ valid: false });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       // token หมดอายุหรือไม่ถูกต้อง
//       return res.status(401).json({ valid: false, error: err.message });
//     }
//     // token valid
//     res.json({ valid: true, user: decoded });
//   });
// };
