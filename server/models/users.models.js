const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 32,
    },
    profile_pic: {
      type: String,
      required: true,
    },
    cloudId: {
      type: String,
    },
    bio: {
      type: String,
      max: 160,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createToken = async function (user) {
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return token;
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
