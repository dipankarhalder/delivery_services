const Joi = require('joi');
const { msg } = require('../constant');

const subCategoryInfoSchema = Joi.object({
  name: Joi.string().max(60).required().messages({
    'string.empty': msg.sub_category_msg.require_name,
    'string.max': msg.sub_category_msg.max_name,
  }),
  desc: Joi.string().max(255).required().messages({
    'string.empty': msg.sub_category_msg.require_desc,
    'string.max': msg.sub_category_msg.max_desc,
  }),
  category: Joi.string().max(255).required().messages({
    'string.empty': msg.sub_category_msg.require_category,
  }),
});

module.exports = {
  subCategoryInfoSchema,
};
