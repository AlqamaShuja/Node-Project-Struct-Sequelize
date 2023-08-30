const router = require("express").Router();
const { signupController, signinController, generateAccessToken } = require("../controllers/authController");
const upload = require("../utils/multer");

// http://localhost:5000/api/auth/signin
router.route("refresh-token").post(generateAccessToken);
router.route("signin").post(signinController);
router.route("signup").post(upload.single("avatar"), signupController);


module.exports = router;