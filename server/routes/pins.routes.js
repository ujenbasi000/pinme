const router = require("express").Router();
const getToken = require("../middlewares/getToken");
const multer = require("multer");
const {
  getPins,
  createPin,
  getPinByCategory,
  getPinByUserUsername,
  getPinByUsernameOrId,
  uploadPin,
  deleteImage,
  savePin,
  savedPins,
  removeSavedPin,
  searchPin,
} = require("../controllers/pins.cotroller");

var upload = multer({ storage: multer.diskStorage({}) });

router.route("/").get(getToken, getPins).post(getToken, createPin);

// search pin
router.route("/search").get(getToken, searchPin);

router
  .route("/upload")
  .post(getToken, upload.single("pin"), uploadPin)
  .delete(getToken, deleteImage);
router.route("/related").get(getToken, getPinByCategory);

router.route("/user/:username").get(getToken, getPinByUserUsername);
router.route("/:username").get(getToken, getPinByUsernameOrId);

// save pin
router
  .route("/save/:id")
  .post(getToken, savePin)
  .get(getToken, savedPins)
  .delete(getToken, removeSavedPin);

module.exports = router;
