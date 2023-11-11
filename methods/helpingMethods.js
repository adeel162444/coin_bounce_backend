const jwt = require("jsonwebtoken");
exports.errorMessage = (res, status, message) => {
  res.status(status).json({
    success: false,
    error: message,
  });
};
exports.storeAcessToken = (res, user) => {
  const token = this.getAccessToken(user);
  res.cookie("access_token", token, {
    sameSite: "None",
    secure: true,
    httpOnly: true,
  });
  return token;
};

exports.getAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_KEY, {
    expiresIn: "4d",
  });
};
