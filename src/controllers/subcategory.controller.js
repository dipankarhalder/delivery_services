const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const { msg } = require('../constant');
const { subCategoryValidate } = require('../validation');
const { validateFields, sendErrorResponse, notFoundItem } = require('../utils');

/* create sub category */
const createSubCategory = async (req, res) => {
  try {
    const decoded = req.user;
    const { error, value } = subCategoryValidate.subCategoryInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    const { name, desc, category } = value;
    const existingSubCategory = await Subcategory.findOne({
      name,
    });
    if (existingSubCategory) {
      return validateFields(res, msg.sub_category_msg.sub_category_already_exist);
    }
    const categoryDetails = await Category.findById(category);
    const categoryInfo = {
      _id: categoryDetails._id,
      name: categoryDetails.name,
    }
    const user = await User.findById(decoded.userid).select('-password');
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
    const newSubCategory = new Subcategory({
      name,
      desc,
      category: categoryInfo,
      user: userInfo,
      lastEditedBy: userInfo,
    });
    await newSubCategory.save();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      category: newSubCategory,
      message: msg.sub_category_msg.new_sub_category_created,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  createSubCategory,
};
