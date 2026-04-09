const db = require("../models");
const { sequelize } = db;
const { Op, fn, col, where } = require("sequelize");
const { emptyToNull } = require("../utils/empty-to-null");
const { sign } = require("jsonwebtoken");

// exports.warn = async (req, res) => {
//   try {
//     const userid = req.user.userid;
//     const doctorid = req.user.doctorid;

//     const fields = ["creator", "viewer", "staff_id", "nurse_id"];

//     const orConditions = fields.map((f) => ({
//       [f]: userid,
//     }));

//     if (doctorid) {
//       orConditions.push({ doctor_id: doctorid });
//     }

//     const forms = await db.Form.findAll({
//       where: {
//         [Op.or]: orConditions,
//         form_status: "pending",
//       },
//     });

//     let needSign = [];

//     // 🔥 loop ทีละ form
//     for (const form of forms) {
//       const [staff_sign, nurse_sign, doctor_sign] = await Promise.all([
//         db.StaffSign.findOne({ where: { form_id: form.id } }),
//         db.NurseSign.findOne({ where: { form_id: form.id } }),
//         db.DoctorSign.findOne({ where: { form_id: form.id } }),
//       ]);

//       // 🔥 เช็คว่า user ต้องเซ็นไหม
//       if (form.staff_id === userid && !staff_sign) {
//         needSign.push({ form_id: form.id, role: "staff" });
//         continue;
//       }

//       if (form.nurse_id === userid && !nurse_sign) {
//         needSign.push({ form_id: form.id, role: "nurse" });
//         continue;
//       }

//       if (doctorid && form.doctor_id === doctorid && !doctor_sign) {
//         needSign.push({ form_id: form.id, role: "doctor" });
//         continue;
//       }
//     }

//     return res.json({
//       count: needSign.length,
//       data: needSign,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };

exports.warn = async (req, res) => {
  const cookie = req.headers.cookie;

  try {
    const userid = req.user.userid;
    const doctorid = req.user.doctorid;

    const where = {
      signed_at: null,
    };

    if (doctorid) {
      where[Op.or] = [{ userid }, { doctorid }];
    } else {
      where.userid = userid;
    }

    const actions = await db.FormAction.findAll({
      where,
      include: [
        {
          model: db.Form,
          attributes: [
            "id",
            "form_type_id",
            "hn",
            "creator",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: db.FormType,
              as: "FormTypeName",
              attributes: ["form_name"],
            },
          ],
        },
      ],
      order: [[{ model: db.Form }, "createdAt", "DESC"]],
    });

    // 🔥 เอา creator id ไม่ซ้ำ
    const creatorIds = [
      ...new Set(actions.map((a) => a.Form?.creator).filter(Boolean)),
    ];

    let personMap = {};

    if (creatorIds.length > 0) {
      const res = await fetch(
        `${process.env.API_URL}user/user-ppk-by-userid/${creatorIds.join(",")}`,
        { headers: { Cookie: cookie } },
      );

      const json = await res.json();

      // 🔥 normalize เป็น array เสมอ
      const persons = Array.isArray(json.user_data)
        ? json.user_data
        : json.user_data
          ? [json.user_data]
          : [];

      // 🔥 FIX: บังคับ key เป็น string + กัน undefined
      personMap = Object.fromEntries(
        persons
          .filter((p) => p?.userid) // ❗กัน undefined key
          .map((p) => [String(p.userid), p]),
      );
    }

    const now = new Date();

    const needSign = actions.map((a) => {
      const creatorId = String(a.Form?.creator);
      const creator = personMap[creatorId];
      const creator_name = creator?.firstname_lastname ?? "ไม่ทราบชื่อ";
      const sex = creator?.sex;
      role = creator.role

      const createdAt = a.Form?.createdAt;
      const createdTime = createdAt ? new Date(createdAt) : null;

      let timeText = "";

      if (createdTime) {
        const diffMs = now - createdTime;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        const isSameDay =
          now.getDate() === createdTime.getDate() &&
          now.getMonth() === createdTime.getMonth() &&
          now.getFullYear() === createdTime.getFullYear();

        const isYesterday =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1,
          ).toDateString() === createdTime.toDateString();

        // 🟢 วันนี้ → แสดงเวลา
        if (isSameDay) {
          const hours = createdTime.getHours().toString().padStart(2, "0");
          const minutes = createdTime.getMinutes().toString().padStart(2, "0");
          timeText = `${hours}:${minutes} น.`;
        }

        // 🟡 เมื่อวาน
        else if (isYesterday) {
          timeText = "เมื่อวาน";
        }

        // 🔵 วันอื่น → แสดงวันที่แบบไทย
        else {
          const thaiMonths = [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
          ];

          const day = createdTime.getDate();
          const month = thaiMonths[createdTime.getMonth()];

          timeText = `${day} ${month}`;
        }
      }

      return {
        id: a.id,
        form_id: a.form_id,
        role,
        hn: a.Form?.hn,
        form_type_id: a.Form?.form_type_id,
        form_type_name: a.Form?.FormTypeName?.form_name,
        status: a.status,
        creator_name,
        creator: a.Form?.creator,
        by_userid: a.userid,
        createdAt,
        updatedAt: a.Form?.updatedAt,
        sex,
        time: timeText, // 👈 ใช้ตัวนี้แทน timeText เดิม
      };
    });

    return res.json({
      count: needSign.filter((i) => i.status === "pending").length,
      notifications: needSign,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.change_status_warn = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ validate status
    const validStatus = ["pending", "viewed", "signed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const action = await db.FormAction.findByPk(id);

    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    // ✅ check permission
    if (
      action.userid !== req.user.userid &&
      action.doctorid !== req.user.doctorid
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ กัน update ซ้ำ
    if (action.status === status) {
      return res.json({ message: "No change" });
    }

    action.status = status;

    // ✅ set timestamp
    if (status === "viewed") {
      action.viewed_at = new Date();
    }

    if (status === "signed") {
      action.signed_at = new Date();
    }

    await action.save();

    return res.json({
      message: "Status updated successfully",
      data: action,
    });
  } catch (error) {
    console.error("CHANGE_STATUS_WARN_ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
