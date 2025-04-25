const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const { envConfig } = require('../config');
const { msg } = require('../constant');
const { authValidate } = require('../validation');
const { validateFields, sendErrorResponse } = require('../utils');

/*
* @ API - User Register
* @ method - POST
* @ end point - http://localhost:4001/api/v1/auth/sign-up
*/
const userSignup = async (req, res) => {
  try {
    /* validate request body */
    const { error, value } = authValidate.userInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    /* find the existing user via email */
    const existingEmail = await User.findOne({
      email: value.email
    });
    if (existingEmail) {
      return validateFields(res, msg.user_msg.email_already_exist);
    }

    /* new user */
    const user = new User({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: value.password,
      phone: value.phone,
      role: value.role,
    });

    /* save the user */
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.user_msg.new_user_created,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - User Login
* @ method - POST
* @ end point - http://localhost:4001/api/v1/auth/sign-in
*/
const userSignin = async (req, res) => {
  try {
    /* validate request body */
    const { error, value } = authValidate.userLoginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    /* find the existing user via email */
    const user = await User.findOne({
      email: value.email
    });
    if (!user) {
      return validateFields(res, msg.user_msg.exist_user_email);
    }

    /* validate / compare the password */
    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return validateFields(res, msg.user_msg.user_wrong_password);
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
      message: msg.user_msg.user_login_successfully,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - User Logout
* @ method - POST
* @ end point - http://localhost:4001/api/v1/auth/sign-out
*/
const userSignout = async (req, res) => {
  try {
    /* sign-out and clear cookie */
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: envConfig.NODEENV,
      sameSite: 'Strict',
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.user_msg.user_logout_successfully,
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
