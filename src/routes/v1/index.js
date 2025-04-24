const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
// const { validToken } = require('../../middleware');
const { auth } = require('../../controllers');

/* authentication */
router.post(routers.end_points.signup, auth.userSignup);
router.post(routers.end_points.signin, auth.userSignin);
router.post(routers.end_points.signout, auth.userSignout);

module.exports = {
  v1Routes: router,
};
