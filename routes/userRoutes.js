const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

// //route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);

router.get("/form", formController.form);

module.exports = router;
