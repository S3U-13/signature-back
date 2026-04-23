const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const choiceController = require("../controllers/choiceController");
const patController = require("../controllers/patController");
const formRadioTherapyController = require("../controllers/formRadioTherapyController");
const userController = require("../controllers/userController");
const manageStaffController = require("../controllers/manageStaffController");
const addSignatureController = require("../controllers/addSignatureController");
const mailController = require("../controllers/mailController");
const pdfController = require("../controllers/pdfController");

// const apiLogger = require("../middleware/apiLogger");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// //route
// router.use(authenticateToken, apiLogger, authorizeRole(1));
router.use(authenticateToken, authorizeRole("doctor", "nurse", "staff"));

// router.get("/mapAll", AllChoiceController.mapAll);

router.get("/form", formController.form);

router.get("/choice", choiceController.choice);
router.get("/prename", patController.prename);

router.get("/pat/:value", patController.pat);
router.get("/pat_visit/:hn", patController.pat_visit_by_hn);

router.get(
  "/pat_vitalsign/:patvisitid",
  patController.pat_vitalsign_by_pat_visit,
);

router.get("/form-radio-therapy-list", formRadioTherapyController.form_list);
router.get("/relation", patController.relation);

router.get(
  "/form-radio-therapy-list/:hn",
  formRadioTherapyController.search_hn_form_list,
);

router.get(
  "/form-by-id/:id",
  formRadioTherapyController.show_pat_form_by_form_id,
);

router.post(
  "/create-form-radio-therapy",
  formRadioTherapyController.crate_form,
);

router.put(
  "/edit-form-radio-therapy/:id",
  formRadioTherapyController.edit_form,
);

//user

router.get("/user-ppk-by-userid/:userid", userController.user_ppk);

router.get("/doctor-ppk-by-doctorid/:doctorid", userController.doctor_ppk);

router.get(
  "/doctors-group-radio-therapy",
  userController.doctors_by_group_radio_therapy,
);

router.get(
  "/user-ppk-group-by-radio-therapy",
  userController.user_ppk_group_by_radio_therapy,
);

// manage staff
router.get("/manage-staff-index", manageStaffController.getManageStaff);
router.get("/get-user-manage-staff", userController.get_user);
router.put(
  "/add-or-delete-manage-staff",
  manageStaffController.addOrDeleteManageStaff,
);
// signature
router.get(
  "/get-signature",
  authenticateToken,
  addSignatureController.signatureByUserid,
);
router.put(
  "/user-add-or-edit-signature",
  addSignatureController.addOrEditSignature,
);
router.post("/confirm-signature", addSignatureController.getSignatureInForm);

//warn
router.get("/count-warn", mailController.warn);
router.put("/change-status-warn/:id", mailController.change_status_warn);

//pdf
router.post("/generate-pdf/:form_id", pdfController.generatePdf);
router.get("/get-pdf/:id", pdfController.getPdf);
router.get("/list-pdf", pdfController.list);
router.delete("/cancel-pdf/:id", pdfController.cancel);

module.exports = router;
