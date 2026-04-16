const db = require("../models");
const { sequelize } = db;
exports.checkAndUpdateFormStatus = async (formId, transaction) => {
  const form = await db.Form.findOne({
    where: { id: formId },
    transaction,
  });

  if (!form) return;

  const requiredUsers = [
    { role: "creator", id: form.creator },
    { role: "staff", id: form.staff_id },
    { role: "nurse", id: form.nurse_id },
    { role: "doctor", id: form.doctorid },
  ].filter((u) => u.id);

  const actions = await db.FormAction.findAll({
    where: {
      form_id: formId,
      status: "signed",
    },
    transaction, // ✅ สำคัญ
  });

  const isAllSigned = requiredUsers.every((user) => {
    return actions.some((action) =>
      user.role === "doctor"
        ? action.doctorid === user.id
        : action.userid === user.id,
    );
  });

  if (isAllSigned) {
    await db.Form.update(
      { form_status: "Success" },
      { where: { id: formId }, transaction }, // ✅ ใส่ด้วย
    );
  }
};
