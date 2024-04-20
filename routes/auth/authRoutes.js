const router = require('express').Router();
const AuthController = require('../../controllers/auth/auth.controllers');

router.post("/register", AuthController.RegisterUser)
router.post("/verify", AuthController.VerifyOtp)
router.put("/save", AuthController.SaveUserData)
router.post("/resend-otp", AuthController.ResendOTP);

router.post("/login", AuthController.LoginUser)
router.post("/verifylogin", AuthController.VerifyLogin)

module.exports = router;

