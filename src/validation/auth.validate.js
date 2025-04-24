const Joi = require('joi');
const { msg } = require('../constant');

const userInfoSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': msg.user_msg.require_first_name,
  }),
  lastName: Joi.string().required().messages({
    'string.empty': msg.user_msg.require_last_name,
  }),
  email: Joi.string().email().required().messages({
    'string.empty': msg.user_msg.require_email,
    'string.email': msg.user_msg.validate_user_email,
  }),
  phone: Joi.string().min(10).required().messages({
    'string.empty': msg.user_msg.require_phone,
    'string.min': msg.user_msg.minimum_phone,
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': msg.user_msg.require_password,
    'string.min': msg.user_msg.minimum_password,
  }),
  role: Joi.string().valid('super_admin', 'collaborator', 'staff').required().messages({
    'any.only': msg.user_msg.require_role,
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': msg.user_msg.require_email,
    'string.email': msg.user_msg.validate_user_email,
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': msg.user_msg.require_password,
    'string.min': msg.user_msg.minimum_password,
  }),
});

const passwordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required().messages({
    'string.empty': msg.user_msg.require_old_password,
    'string.min': msg.user_msg.old_minimum_password,
  }),
  newPassword: Joi.string().min(6).required().not(Joi.ref('oldPassword')).messages({
    'string.empty': msg.user_msg.require_new_password,
    'string.min': msg.user_msg.new_minimum_password,
    'any.only': msg.user_msg.compare_both_password,
  }),
});

module.exports = {
  userInfoSchema,
  userLoginSchema,
  passwordSchema,
};
