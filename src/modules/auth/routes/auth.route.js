const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const OauthController = require('../controllers/oauth.controller');
const {guest, auth} = require("../../../middlewares");

router.post('/api/v1/auth/login', [guest, AuthController.login]);
router.get('/api/v1/auth/validate-token', [auth, AuthController.validateToken]);
router.post('/api/v1/auth/register', [guest, AuthController.register]);
router.post('/api/v1/auth/forgot-password', [guest, AuthController.forgotPassword]);
router.post('/api/v1/auth/reset-password', [guest, AuthController.resetPassword]);
router.get('/api/v1/auth/logout', AuthController.logout);
router.post('/api/v1/auth/verify', [auth, AuthController.verify]);
router.post('/api/v1/auth/verify/resend', [auth, AuthController.verifyResend]);

router.post('/api/v1/auth/google', [guest, OauthController.google.login]);

module.exports = router;