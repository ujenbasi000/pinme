const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const Pins = require("../models/pins.models");
const SavedPin = require("../models/save.models");

const getPins = asyncHandler(async (req, res) => {
  try {
    const pins = await Pins.find()
      .populate("postedBy", "-password -cloudId")
      .populate({ path: "save", populate: { path: "user" } });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Pins found",
      pins: pins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server Error",
      error: error.message,
    });
  }
});

const createPin = asyncHandler(async (req, res) => {
  try {
    const { title, description, category, destination, image, cloudId } =
      req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Please enter all fields",
      });
    }

    if (!image && !cloudId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Please upload an image",
      });
    }

    const newPin = await Pins.create({
      title,
      description,
      category,
      destination,
      image,
      cloudId,
      postedBy: req.user,
    });

    // const databaseReponse = await newPin.save();

    res.status(201).json({
      success: true,
      status: 201,
      pin: newPin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server Error",
      error: error.message,
    });
  }
});

const getPinByCategory = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.category
      ? {
          category: {
            $regex: req.query.category,
            $options: "i",
          },
        }
      : {};

    const pins = await Pins.find(keyword, null, { limit: 6 })
      .populate("postedBy", "-password -cloudId")
      .populate({ path: "save", populate: { path: "user" } });
    res.status(200).json({
      success: true,
      status: 200,
      message: "Pins founded",
      pins: pins,
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

const getPinByUserUsername = asyncHandler(async (req, res) => {
  try {
    const pins = await Pins.find()
      .populate("postedBy")
      .populate({ path: "save", populate: { path: "user" } });
    const data = pins.filter(
      (pin) => pin.postedBy.username === req.params.username
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "Pins found",
      pins: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
    });
  }
});

const getPinByUsernameOrId = asyncHandler(async (req, res) => {
  try {
    const pin = await Pins.findOne({ _id: req.params.username })
      .populate("postedBy", "-password -cloudId")
      .populate("comments")
      .populate({ path: "comments", populate: { path: "user" } })
      .populate({ path: "save", populate: { path: "user" } });

    if (!pin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Pin not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "Pin found",
      pin: pin,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "Pin not found",
    });
  }
});

const uploadPin = asyncHandler(async (req, res) => {
  const file = req.file;

  if (file === undefined) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Please upload an image",
    });
  }

  //uploading image to cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
    upload_preset: "dev_setups",
    folder: "pins",
  });

  res.json({
    success: true,
    status: 200,
    message: "Image uploaded",
    response: {
      image: cloudinaryResponse.secure_url,
      cloudId: cloudinaryResponse.public_id,
    },
  });
});

const deleteImage = asyncHandler(async (req, res) => {
  const { cloudId } = req.query;
  const response = await cloudinary.uploader.destroy(`pins/${cloudId}`);
  if (response.result === "not found") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Image not found",
    });
  }
  res.json({
    success: true,
    status: 200,
    message: "Image deleted",
  });
});

const savePin = asyncHandler(async (req, res) => {
  try {
    // getting pin ko original id
    // logged in ko id liye
    // tio save garni pin ko id lai find gare
    // yedi save garna lako pin bhetena bhane return status 404
    // save bhanne db ma ko user le save gareko id ra kun pin lai save gareko tesko id lai db ma hale
    //

    const pinId = req.params.id;
    const user = req.user;

    const findPin = await Pins.findById(pinId);

    if (!findPin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Pin not found",
      });
    }

    const savedPin = await SavedPin.create({
      user,
      pin: pinId,
    });

    const updatePin = await Pins.findByIdAndUpdate(
      pinId,
      { $push: { save: savedPin._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: "Pin saved",
      savedPin: updatePin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
});

const savedPins = asyncHandler(async (req, res) => {
  try {
    const user = req.params.id;
    const savedPins = await SavedPin.find({ user: user }).populate(
      "pin",
      "-cloudId"
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "Saved Pins found",
      savedPins: savedPins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
    });
  }
});

const removeSavedPin = asyncHandler(async (req, res) => {
  try {
    const saveId = req.params.id;
    const user = req.user;
    const findPin = await SavedPin.findOne({ pin: saveId, user: user });

    if (!findPin) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Pin not found",
      });
    }
    const deletedPin = await SavedPin.findByIdAndDelete(findPin._id);
    const updatePin = await Pins.findByIdAndUpdate(
      saveId,
      { $pull: { save: deletedPin._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      status: 200,

      message: "Pin removed",
      deletedPin: deletedPin,
      updatedOriginalPin: updatePin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
    });
  }
});

const searchPin = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    const pins = await Pins.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      status: 200,
      message: "Pins found",
      pins: pins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
    });
  }
});

module.exports = {
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
};
