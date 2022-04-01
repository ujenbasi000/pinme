const mongoose = require("mongoose");

const SaveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  pin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pin",
    required: true,
  },
});

const Save = mongoose.model("Save", SaveSchema);
module.exports = Save;
