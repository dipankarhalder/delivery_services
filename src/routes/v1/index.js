const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
const { auth_token } = require('../../middleware');
const { auth, profile } = require('../../controllers');

/* authentication */
router.post(routers.end_points.signup, auth.userSignup);
router.post(routers.end_points.signin, auth.userSignin);
router.post(routers.end_points.signout, auth.userSignout);

router.get(routers.end_points.profile_details, auth_token, profile.getProfileDetails);
router.patch(routers.end_points.update_password, auth_token, profile.updateAdminPassword);

module.exports = {
  v1Routes: router,
};
