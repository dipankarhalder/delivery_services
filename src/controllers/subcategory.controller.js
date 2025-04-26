const { StatusCodes } = require('http-status-codes');

const User = require('../models/user.model');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const { msg } = require('../constant');
const { subCategoryValidate } = require('../validation');
const { validateFields, sendErrorResponse, notFoundItem } = require('../utils');

/*
* @ API - Add New Sub Category
* @ method - POST
* @ end point - http://localhost:4001/api/v1/subcategory/add-new
*/
const createSubCategory = async (req, res) => {
  try {
    const decoded = req.user;

    /* validate request body */
    const { error, value } = subCategoryValidate.subCategoryInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res,
        error.details.map((detail) => detail.message).join(', ')
      );
    }

    /* find existing sub category */
    const { name, desc, category } = value;
    const existingSubCategory = await Subcategory.findOne({
      name,
    });
    if (existingSubCategory) {
      return validateFields(res, msg.sub_category_msg.sub_category_already_exist);
    }

    /* find the category information */
    const categoryDetails = await Category.findById(category);
    const categoryInfo = {
      _id: categoryDetails._id,
      name: categoryDetails.name,
    }

    /* find the user information */
    const user = await User.findById(decoded.userid).select('-password');
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }

    /* new sub category */
    const newSubCategory = new Subcategory({
      name,
      desc,
      category: categoryInfo,
      user: userInfo,
      lastEditedBy: userInfo,
    });

    /* save new sub category */
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
/*
* @ API - List of Sub Categories
* @ method - GET
* @ end point - http://localhost:4001/api/v1/subcategory/lists
*/
const getAllSubCategories = async (req, res) => {
  try {
    /* find sub category */
    const subcategories = await Subcategory.find();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      list: subcategories,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - Category Details
* @ method - GET
* @ end point - http://localhost:4001/api/v1/subcategory/:id
*/
const getSubCategory = async (req, res) => {
  try {
    const sub_categoryId = req.params.id;

    /* find category by ID */
    const subCategoryDetails = await Subcategory.findById(sub_categoryId);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      details: subCategoryDetails,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/*
* @ API - Delete Category Details
* @ method - DELETE
* @ end point - http://localhost:4001/api/v1/subcategory/:id
*/
const deleteSubCategory = async (req, res) => {
  try {
    const sub_categoryId = req.params.id;

    /* check the sub category is available or not */
    const sub_category = await Subcategory.findById(sub_categoryId);
    if (!sub_category) {
      return notFoundItem(res, msg.sub_category_msg.sub_category_not_found);
    }

    /* delete the sub category */
    await Subcategory.findByIdAndDelete(sub_categoryId);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: msg.sub_category_msg.sub_category_deleted,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};



module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory,
};
