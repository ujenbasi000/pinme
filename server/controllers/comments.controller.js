const asyncHandler = require("express-async-handler");
const Comment = require("../models/comments.models");
const Pin = require("../models/pins.models");

const createComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const pinId = req.params.id;
  const userId = req.user;
  const newComment = await Comment.create({
    comment,
    user: userId,
  });

  const updatedPin = await Pin.findByIdAndUpdate(
    pinId,
    { $push: { comments: newComment._id } },
    { new: true }
  )
    .populate("comments postedBy")
    .populate({ path: "comments", populate: { path: "user" } });

  res.status(201).json({
    success: true,
    status: 201,
    message: "Comment created successfully",
    pin: updatedPin,
  });
});

module.exports = {
  createComment,
};
