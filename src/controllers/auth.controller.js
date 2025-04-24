const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const { envConfig } = require('../config');
const { msg } = require('../constant');
const { authValidate } = require('../validation');
const { validateFields, sendErrorResponse } = require('../utils');

/* user signup */
const userSignup = async (req, res) => {
  try {
    /* validate request body */
    const { error, value } = authValidate.userInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res, error.details.map((detail) => detail.message).join(', '));
    }

    /* find the existing user via email */
    const existingEmail = await User.findOne({ email: value.email });
    if (existingEmail) {
      return validateFields(res, msg.userMsg.email_already_exist);
    }

    /* new user */
    const user = new User({
      name: value.name,
      email: value.email,
      password: value.password,
      phone: value.phone,
    });
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.userMsg.new_user_created,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* user signin */
const userSignin = async (req, res) => {
  try {
    /* validate request body */
    const { error, value } = authValidate.userLoginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res, error.details.map((detail) => detail.message).join(', '));
    }

    /* find the existing user via email */
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return validateFields(res, msg.userMsg.exist_user_email);
    }

    /* validate / compare the password */
    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return validateFields(res, msg.userMsg.user_wrong_password);
    }

    /* generated token */
    const token = user.generateAuthToken();
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: envConfig.NODEENV,
      maxAge: envConfig.EXPTIME,
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      token: token,
      message: msg.userMsg.user_login_successfully,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* user signin */
const userSignout = async (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: envConfig.NODEENV,
      sameSite: 'Strict',
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.userMsg.user_logout_successfully,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  userSignup,
  userSignin,
  userSignout,
};
