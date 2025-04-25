const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const { msg } = require('../constant');
const { authValidate } = require('../validation');
const { validateFields, sendErrorResponse, notFoundItem } = require('../utils');

/* user profile */
const getProfileDetails = async (req, res) => {
  try {
    /* find the user information using userID */
    const user = await User.findById(req.user.userid).select('-password');
    if (!user) {
      return notFoundItem(res, msg.user_msg.user_not_found);
    }
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: user,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* update admin password */
const updateAdminPassword = async (req, res) => {
  try {
    const decoded = req.user;
    const { error, value } = authValidate.passwordSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    const user = await User.findById(req.user.userid);
    if (!user) {
      return validateFields(res, msg.user_msg.user_not_found);
    }
    const isMatch = await user.comparePassword(value.oldPassword);
    if (!isMatch) {
      return validateFields(res, msg.user_msg.user_wrong_password);
    }
    user.password = value.newPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.user_msg.updated_user_password,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};


module.exports = {
  getProfileDetails,
  updateAdminPassword,
  // getUserProfiles,
  // updatePassword,
};
