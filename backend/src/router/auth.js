const express = require("express");
const { passwordReset, requestPasswordReset } = require("../controller/auth");

const router = express.Router();
router.route("/reqpasswordreset").post(requestPasswordReset);
router.route("/passwordreset").post(passwordReset);

module.exports = router;
