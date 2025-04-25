const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const Category = require('../models/category.model');
const { msg } = require('../constant');
const { categoryValidate } = require('../validation');
const { validateFields, sendErrorResponse, notFoundItem } = require('../utils');

/* create category */
const createCategory = async (req, res) => {
  try {
    const decoded = req.user;
    const { error, value } = categoryValidate.categoryInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    const { name, desc } = value;
    const existingCategory = await Category.findOne({
      name,
    });
    if (existingCategory) {
      return validateFields(res, msg.category_msg.category_already_exist);
    }

    const user = await User.findById(decoded.userid).select('-password');
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }

    const newCategory = new Category({
      name,
      desc,
      user: userInfo,
      lastEditedBy: userInfo,
    });

    await newCategory.save();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      category: newCategory,
      message: msg.category_msg.new_category_created,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* get all categories */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      list: categories,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* get category */
const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryDetails = await Category.findById(categoryId);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      details: categoryDetails,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* edit category */
const editCategory = async (req, res) => {
  try {
    const decoded = req.user;
    const categoryId = req.params.id;
    const { error, value } = categoryValidate.categoryInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return notFoundItem(res, msg.category_msg.category_not_found);
    }
    const user = await User.findById(decoded.userid).select('-password');
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
    const updateCategory = {
      name: value.name || category.name,
      desc: value.desc || category.desc,
      lastEditedBy: userInfo,
    }
    const updatedNewCategory = await Category.findByIdAndUpdate(categoryId, updateCategory, { new: true });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      details: updatedNewCategory,
      message: msg.category_msg.category_updated,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* delete category */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return notFoundItem(res, msg.category_msg.category_not_found);
    }
    await Category.findByIdAndDelete(categoryId);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.category_msg.category_deleted,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  editCategory,
  deleteCategory,
};
