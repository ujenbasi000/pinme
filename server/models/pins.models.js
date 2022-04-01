const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Art",
        "Culture",
        "Food",
        "Nature",
        "Sports",
        "Technology",
        "Travel",
        "Cars",
        "Fashion",
        "Music",
        "Dogs",
        "Website",
        "Other",
      ],
      default: "Other",
    },
    destination: {
      type: String,
      required: false,
      default: null,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    image: {
      type: String,
    },
    cloudId: {
      type: String,
    },
    save: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Save",
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pin = mongoose.model("Pin", PinSchema);
module.exports = Pin;
