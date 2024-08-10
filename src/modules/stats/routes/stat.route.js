const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/stat.controller');
const {auth, verified} = require("../../../middlewares");

router.get('/api/v1/stats/summary', [auth, verified, StatsController.summary]);

module.exports = router;