const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const getToken = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Please login to continue",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded._id;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Invalid user..." });
  }
});

module.exports = getToken;
