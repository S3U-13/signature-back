const db = require("../models");
const { sequelize } = db;
const { emptyToNull } = require("../utils/empty-to-null");
const { signBuffers } = require("../utils/signatureInputHelper");

exports.doctorAddOrEditSignature = async (doctorid, userid, body) => {
  try {
    const cleanedBody = emptyToNull(body);
    const { signature, note, editdatetime } = cleanedBody;

    let signatureBuffer = {};
    if (signature) {
      signatureBuffer = signBuffers({ signature }); // 🔥 fix
    }

    await db.DoctorImage.upsert({
      doctorid,
      userid,
      note,
      editdatetime,
    });

    const user_sign = await db.DoctorImage.findOne({
      where: { userid },
    });

    await db.DoctorImageData.upsert({
      id: user_sign.id,
      imagedata: signatureBuffer.signature || null, // 🔥 fix
    });

    return {
      message: "เพิ่มลายเซ็นสำเร็จ",
    };
  } catch (error) {
    throw error;
  }
};
