const { StatusCodes } = require('http-status-codes');
const { msg } = require('../constant');

const sendErrorResponse = (res, error) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: msg.app_msg.some_thing_wrong,
    error: error.message,
  });
};

const validateFields = (res, messages) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status: StatusCodes.BAD_REQUEST,
    message: messages,
  });
};

const notFoundItem = (res, messages) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: messages,
  });
};

module.exports = {
  sendErrorResponse,
  validateFields,
  notFoundItem,
};
