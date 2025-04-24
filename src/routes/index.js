const express = require('express');

const { routers } = require('../constant');
const { v1Routes } = require('./v1');

const router = express.Router();
router.use(routers.endPoints.v1Base, v1Routes);

module.exports = {
  RootApiRouter: router,
};
