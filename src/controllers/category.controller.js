const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const Category = require('../models/category.model');
const { msg } = require('../constant');
const { categoryValidate } = require('../validation');
const { validateFields, sendErrorResponse, notFoundItem } = require('../utils');

/*
* @ API - Add New Category
* @ method - POST
* @ end point - http://localhost:4001/api/v1/category/add-new
*/
const createCategory = async (req, res) => {
  try {
    const decoded = req.user;

    /* validate request body */
    const { error, value } = categoryValidate.categoryInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    /* find existing category */
    const { name, desc } = value;
    const existingCategory = await Category.findOne({
      name,
    });
    if (existingCategory) {
      return validateFields(res, msg.category_msg.category_already_exist);
    }

    /* find the user information */
    const user = await User.findById(decoded.userid).select('-password');
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }

    /* new category */
    const newCategory = new Category({
      name,
      desc,
      user: userInfo,
      lastEditedBy: userInfo,
    });

    /* save new category */
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

/*
* @ API - List of Categories
* @ method - GET
* @ end point - http://localhost:4001/api/v1/category/lists
*/
const getAllCategories = async (req, res) => {
  try {
    /* find category */
    const categories = await Category.find();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      list: categories,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - Category Details
* @ method - GET
* @ end point - http://localhost:4001/api/v1/category/:id
*/
const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    /* find category by ID */
    const categoryDetails = await Category.findById(categoryId);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      details: categoryDetails,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - Edit Category Details
* @ method - PATCH
* @ end point - http://localhost:4001/api/v1/category/:id
*/
const editCategory = async (req, res) => {
  try {
    const decoded = req.user;
    const categoryId = req.params.id;

    /* validate request body */
    const { error, value } = categoryValidate.categoryInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    /* check the category is available or not */
    const category = await Category.findById(categoryId);
    if (!category) {
      return notFoundItem(res, msg.category_msg.category_not_found);
    }

    /* find the user information */
    const user = await User.findById(decoded.userid).select('-password');
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }

    /* updated category information */
    const updateCategory = {
      name: value.name || category.name,
      desc: value.desc || category.desc,
      lastEditedBy: userInfo,
    }

    /* update information */
    const updatedNewCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateCategory,
      { new: true }
    );

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      details: updatedNewCategory,
      message: msg.category_msg.category_updated,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - Delete Category Details
* @ method - DELETE
* @ end point - http://localhost:4001/api/v1/category/:id
*/
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    /* check the category is available or not */
    const category = await Category.findById(categoryId);
    if (!category) {
      return notFoundItem(res, msg.category_msg.category_not_found);
    }

    /* delete the category */
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
