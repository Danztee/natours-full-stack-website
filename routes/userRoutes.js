const express = require("express");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require("../controllers/authController");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// protect all routes after this middleware
router.use(protect);

router.get("/me", getMe, getUser);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
