const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  register,
  login,
  getUser,
  logout,
  deleteUser,
  changeProfile,
  updateUser,
  getUserByUsername,
} = require("../controllers/users.controller");
const getToken = require("../middlewares/getToken");
var upload = multer({ storage: multer.diskStorage({}) });

router
  .route("/")
  .get(getToken, getUser)
  .post(upload.single("image"), register)
  .put(getToken, upload.single("image"), changeProfile);

router.route("/update").put(getToken, updateUser);

router.route("/login").post(login);

router.route("/logout").get(logout);

router
  .route("/:id")
  .delete(getToken, deleteUser)
  .get(getToken, getUserByUsername);

module.exports = router;
