const router = require('express').Router();
// const User = require('../models/User');
const UserController = require('../../controllers/user/user.controllers');
// const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('../../middlewares/verifyToken');

//fetch user

router.post("/create",UserController.Createuser)
router.get("/find/:id",UserController.GetUser);
router.get("/all", UserController.GetAllUsers);
router.put("/:id", UserController.Updateuser);
router.delete("/:id",UserController.DeleteUser)

module.exports = router;

