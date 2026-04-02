const db = require("../models");
const { sequelize } = db;
const { signBuffers } = require("../utils/signatureInputHelper");

exports.signatureByUserid = async (req, res) => {
  const { userid } = req.params;
  try {
    const user_sign = await db.UserSign.findOne({
      where: { userid: userid },
    });
    return res.status(200).json(user_sign);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.addUserSignature = async (req, res) => {
  try {
    const { signature } = req.body;

    let signatureBuffer = {};
    if (signature) {
      signatureBuffer = signBuffers({ signature });
    }

    const user_sign = await db.UserSign.upsert({
      userid: req.user.userid,
    });

    await db.UserSignData.upsert({
      id: user_sign.id,
      signature: signatureBuffer.signature,
    });

    return res.status(200).json({ message: "เพิ่มลายเซ็นสำเร็จ" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.addDoctorSignature = async (req, res) => {
  try {
    const { imagedata } = req.body;

    let signatureBuffer = {};
    if (imagedata) {
      signatureBuffer = signBuffers({ imagedata });
    }

    const user_sign = await db.UserSign.upsert({
      doctorid: req.user.doctorid,
      userid: req.user.userid,
    });

    await db.UserSignData.upsert({
      id: user_sign.id,
      signature: signatureBuffer.imagedata,
    });

    return res.status(200).json({ message: "เพิ่มลายเซ็นสำเร็จ" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
