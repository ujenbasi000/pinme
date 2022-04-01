require("dotenv").config();
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");
const User = require("../models/users.models");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Please enter all fields",
    });
  }
  if (password.length < 8 || password.length > 32) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Password must be between 8 and 32 characters",
    });
  }
  if (password !== confirmPassword) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Passwords do not match",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "User already exists",
    });
  }

  let userProfile = "";
  let cloudid = "";

  if (req.file !== undefined) {
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "dev_setups",
    });
    userProfile = cloudinaryResponse.secure_url;
    cloudid = cloudinaryResponse.public_id;
  }

  const newUser = new User({
    name,
    email,
    password,
    username: name.replace(/\s+/g, "").toLowerCase(),
    profile_pic:
      req.file === undefined
        ? `https://avatars.dicebear.com/api/big-smile/${name.split(" ")[0]}.svg`
        : userProfile,
    cloudId: req.file === undefined ? undefined : cloudid,
  });

  const token = await newUser.createToken(newUser._id);

  await newUser.save();
  res.status(201).cookie("token", token).json({
    success: true,
    status: 201,
    message: "User created successfully",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Please enter all fields",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Invalid credentials",
    });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Invalid credentials",
    });
  }
  const token = await user.createToken(user);
  res.status(200).cookie("token", token).json({
    success: false,
    status: 200,
    message: "User logged in successfully",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  if (!user) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    status: 200,
    message: "User found",
    user: user,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    status: 200,
    message: "User Loggout successfully",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const deletingUser = req.params.id;
  if (!req.user) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });
  }

  if (deletingUser !== user) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "You are not authorized to delete this user",
    });
  }

  const data = await User.findByIdAndDelete(user);

  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      status: 200,
      message: "User deleted successfully",
      deleted_User: data,
    });
});

const getUserByUsername = asyncHandler(async (req, res) => {
  try {
    const username = req.params.id;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: "User found",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
    });
  }
});

const changeProfile = asyncHandler(async (req, res) => {
  try {
    const { cloudId } = req.body;
    console.log(cloudId);

    if (cloudId !== undefined) {
      const removeImage = await cloudinary.uploader.destroy(cloudId);
      console.log("Image remove Response: ", removeImage);
    }

    let userProfile = "";
    let cloudid = "";

    if (req.file !== undefined) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
          upload_preset: "dev_setups",
        }
      );
      console.log("Uploading Response: ", cloudinaryResponse);
      userProfile = cloudinaryResponse.secure_url;
      cloudid = cloudinaryResponse.public_id;
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      {
        profile_pic: userProfile,
        cloudId: cloudid,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, username, website, bio } = req.body;

  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });
  }

  const data = await User.findByIdAndUpdate(
    user._id,
    {
      name,
      username,
      website,
      bio,
    },
    { new: true }
  );

  console.log("Update Response: ", data);

  res.status(200).json({
    success: true,
    status: 200,
    message: "User updated successfully",
    user: data,
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  deleteUser,
  getUserByUsername,
  changeProfile,
  updateUser,
};
