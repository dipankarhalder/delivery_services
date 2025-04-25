const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
const { auth_token } = require('../../middleware');
const {
  auth,
  profile,
  category,
  subcategory
} = require('../../controllers');

/* authentication */
router.post(routers.end_points.sign_up, auth.userSignup);
router.post(routers.end_points.sign_in, auth.userSignin);
router.post(routers.end_points.sign_out, auth.userSignout);

/* profile */
router.get(routers.end_points.profile_details, auth_token, profile.getProfileDetails);
router.patch(routers.end_points.update_password, auth_token, profile.updateAdminPassword);

/* categories */
router.post(routers.end_points.new_category, auth_token, category.createCategory);
router.get(routers.end_points.all_categories, auth_token, category.getAllCategories);
router.get(routers.end_points.get_category, auth_token, category.getCategory);
router.patch(routers.end_points.get_category, auth_token, category.editCategory);
router.delete(routers.end_points.get_category, auth_token, category.deleteCategory);

/* sub categories */
router.post(routers.end_points.new_sub_category, auth_token, subcategory.createSubCategory);
router.get(routers.end_points.all_sub_category, auth_token, subcategory.getAllSubCategories);

module.exports = {
  v1Routes: router,
};
