const Joi = require('joi');
const { msg } = require('../constant');

const categoryInfoSchema = Joi.object({
  name: Joi.string().max(60).required().messages({
    'string.empty': msg.category_msg.require_name,
    'string.max': msg.category_msg.max_name,
  }),
  desc: Joi.string().max(255).required().messages({
    'string.empty': msg.category_msg.require_desc,
    'string.max': msg.category_msg.max_desc,
  }),
});

module.exports = {
  categoryInfoSchema,
};
