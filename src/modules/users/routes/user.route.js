const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const {auth, verified} = require("../../../middlewares");

router.get('/api/v1/users', [auth, verified, UserController.index]);

module.exports = router;