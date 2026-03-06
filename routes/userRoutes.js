const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const choiceController = require("../controllers/choiceController");
const patController = require("../controllers/patController");
const formRadioTherapyController = require("../controllers/formRadioTherapyController");

// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

// //route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);

router.get("/form", formController.form);

router.get("/choice", choiceController.choice);

router.get("/pat/:value", patController.pat);
router.get("/pat_visit/:hn", patController.pat_visit_by_hn);
router.get("/pat_vitalsign/:patvisitid", patController.pat_vitalsign_by_pat_visit);
router.get("/form-radio-therapy-list", formRadioTherapyController.form_list);

router.get(
  "/form-radio-therapy-list/:hn",
  formRadioTherapyController.search_hn_form_list,
);

router.get(
  "/form-by-id/:id",
  formRadioTherapyController.show_pat_form_by_form_id,
);

router.post(
  "/doc-create-form-radio-therapy",
  formRadioTherapyController.crate_form_by_doc,
);

router.put("/edit-form-radio-therapy/:id", formRadioTherapyController.edit_form)

module.exports = router;
