const db = require("../models");
const { sequelize } = db;
const { signBuffers } = require("../utils/signatureInputHelper");
const jwt = require("jsonwebtoken");
const { signBase64 } = require("../utils/singBase64Service");
const {
  userAddOrEditSignature,
} = require("../services/userAddOrEditSignature");
const {
  doctorAddOrEditSignature,
} = require("../services/doctorAddOrEditSignature");

exports.signatureByUserid = async (req, res) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    let user_sign = null;
    let signField = null;

    // 🔥 แยก query ตาม role
    if (["nurse", "staff"].includes(decoded.role)) {
      user_sign = await db.UserSign.findOne({
        where: { userid: decoded.userid },
        include: [
          {
            model: db.UserSignData,
            as: "SignData",
          },
        ],
      });

      signField = user_sign?.SignData;
    } else if (decoded.role === "doctor") {
      user_sign = await db.DoctorImage.findOne({
        where: { userid: decoded.userid },
        include: [
          {
            model: db.DoctorImageData,
            as: "DoctorSignData",
          },
        ],
      });

      signField = user_sign?.DoctorSignData;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user_sign) {
      return res.status(404).json({ message: "ไม่พบลายเซ็น" });
    }

    // 🔥 รวม logic signature
    const signatureData = signField.signature
      ? signBase64(signField.signature)
      : signBase64(signField.imagedata);

    const signature_date = user_sign.updatedAt
      ? user_sign.updatedAt
      : user_sign.editdatetime;

    const signature = {
      note: user_sign.note || null,
      flag_type: user_sign.flag_type || null,
      flag_default: user_sign.flag_default || null,
      flag_cancel: user_sign.flag_cancel || null,
      signature_date,
      signature: signatureData,
    };

    return res.status(200).json(signature);
  } catch (error) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: error.message });
  }
};

exports.addOrEditSignature = async (req, res) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    switch (decoded.role) {
      case "staff":
      case "nurse":
        await userAddOrEditSignature(decoded.userid, req.body);
        break;

      case "doctor":
        await doctorAddOrEditSignature(
          decoded.doctorid,
          decoded.userid,
          req.body,
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    return res.status(200).json({ message: "เพิ่ม/แก้ไขลายเซ็นสำเร็จ" });
  } catch (error) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: error.message });
  }
};
