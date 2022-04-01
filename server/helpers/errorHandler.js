const errorHandler = (req, res, stat, err, token) => {
  console.log("errorHandler - token: ", token);
  return token !== undefined
    ? res
        .status(stat)
        .cookie("token", token, { httpOnly: true })
        .json({
          success: stat === 200 || stat === 201 ? true : false,
          status: stat,
          message: err,
        })
    : res.status(stat).json({
        success: stat === 200 || stat === 201 ? true : false,
        status: stat,
        message: err,
      });
};

module.exports = errorHandler;
