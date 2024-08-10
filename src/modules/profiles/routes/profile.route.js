const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');
const {auth, verified} = require("../../../middlewares");

router.get('/api/v1/profile', [auth, verified, ProfileController.show]);
router.put('/api/v1/profile', [auth, verified, ProfileController.update]);
router.put('/api/v1/profile/password', [auth, verified, ProfileController.updatePassword]);

module.exports = router;