const express = require("express");
const { onboardTeacher } = require("../controllers/teacherController");

const router = express.Router();

router.post("/onboard", onboardTeacher);

module.exports = router;