const router = require("express").Router();
const getToken = require("../middlewares/getToken");
const {
  getAllComments,
  createComment,
} = require("../controllers/comments.controller");

router.route("/:id").post(getToken, createComment);

module.exports = router;
