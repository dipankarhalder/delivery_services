const express = require('express');
const router = express.Router();

const { routers } = require('../../constant');
// const { validToken } = require('../../middleware');
const { auth } = require('../../controllers');

/* authentication */
router.post(routers.endPoints.signup, auth.userSignup);
router.post(routers.endPoints.signin, auth.userSignin);
router.post(routers.endPoints.signout, auth.userSignout);

module.exports = {
  v1Routes: router,
};
