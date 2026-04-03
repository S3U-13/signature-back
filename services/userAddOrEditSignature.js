const db = require("../models");
const { sequelize } = db;
const { emptyToNull } = require("../utils/empty-to-null");
const { signBuffers } = require("../utils/signatureInputHelper");

exports.userAddOrEditSignature = async (userid, body) => {
  const t = await sequelize.transaction();

  try {
    const cleanedBody = emptyToNull(body);
    const { signature, note } = cleanedBody;

    let signatureBuffer = {};
    if (signature) {
      signatureBuffer = signBuffers({ signature });
    }

    await db.UserSign.upsert({
      userid,
      note,
    });

    const user_sign = await db.UserSign.findOne({
      where: { userid },
    });

    await db.UserSignData.upsert({
      id: user_sign.id,
      signature: signatureBuffer.signature || null,
    });

    return {
      message: "เพิ่มลายเซ็นสำเร็จ",
    };
  } catch (error) {
    throw error; // ❗โยนกลับให้ controller handle
  }
};
