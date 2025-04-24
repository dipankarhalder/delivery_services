const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { envConfig } = require('../config');
const { msg } = require('../constant');

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.user_msg.access_denied,
      });
    }
    const decoded = jwt.verify(token, envConfig.JWTSECRET);
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: msg.user_msg.invalid_token,
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: msg.user_msg.invalid_token,
      error: error.message,
    });
  }
};

module.exports = verifyToken;
