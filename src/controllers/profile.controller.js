const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const { msg } = require('../constant');
const { authValidate } = require('../validation');
const { validateFields, sendErrorResponse, notFoundItem } = require('../utils');

/*
* @ API - Logged-in User Details
* @ method - GET
* @ end point - http://localhost:4001/api/v1/profile/me
*/
const getProfileDetails = async (req, res) => {
  try {
    /* find user by id */
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

/*
* @ API - Update Admin Password
* @ method - PATCH
* @ end point - http://localhost:4001/api/v1/profile/update-admin-password
*/
const updateAdminPassword = async (req, res) => {
  try {
    const decoded = req.user;

    /* validate request body */
    const { error, value } = authValidate.passwordSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    /* find the user by id */
    const user = await User.findById(decoded.userid);
    if (!user) {
      return validateFields(res, msg.user_msg.user_not_found);
    }

    /* compare the password */
    const isMatch = await user.comparePassword(value.oldPassword);
    if (!isMatch) {
      return validateFields(res, msg.user_msg.user_wrong_password);
    }

    /* save updated password */
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
};
