const authValidation = require('../validations/auth.validation');
const authService = require('../services/auth.service');
const authDto = require('../dtos/auth.dto');

async function login(req, res, next) {
    try {
        const data = authValidation.login(req.body);
        const dto = authDto.login.fromJson(data);
        const user = await authService.login(dto);

        res.status(200).json({
            data: user,
            success: true,
            message: 'User logged in successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while attempting login`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function validateToken(req, res, next) {
    try {
        const token = req.get("Authorization")?.replace("Bearer ", "");
        const data = authValidation.validateToken({token});
        const dto = authDto.validateToken.fromJson(data);
        const user = await authService.validateToken(dto);

        res.status(200).json({
            data: user,
            success: true,
            message: 'User token validated successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while validating token`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function register(req, res, next) {
    try {
        const data = authValidation.register(req.body);
        const dto = authDto.register.fromJson(data);
        const user = await authService.register(dto);

        res.status(201).json({
            data: user,
            success: true,
            message: 'User created successfully',
            code: 201
        });
    } catch (err) {
        console.error(`Error while registring user`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function forgotPassword(req, res, next) {
    try {
        const data = authValidation.forgotPassword(req.body);
        const dto = authDto.forgotPassword.fromJson(data);
        const user = await authService.forgotPassword(dto);

        res.status(201).json({
            data: {
                email: user.email
            },
            success: true,
            message: 'Reset password email sent successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while sending reset password email`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function resetPassword(req, res, next) {
    try {
        const data = authValidation.resetPassword(req.body);
        const dto = authDto.resetPassword.fromJson(data);
        const user = await authService.resetPassword(dto);

        res.status(201).json({
            data: {
                email: user.email
            },
            success: true,
            message: `Password has been updated for ${user.email}`,
            code: 200
        });
    } catch (err) {
        console.error(`Error while resetting password`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function logout(req, res, next) {
    try {
        const token = req.get('Authorization')?.replace('Bearer ', '');

        await authService.logout(token);

        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while attempting logout`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function verify(req, res, next) {
    try {
        const user = res.locals.user;
        const data = authValidation.verify(req.body);
        const dto = authDto.verify.fromJson(data);
        const verifiedUser = await authService.verify(user, dto);

        res.status(200).json({
            data: verifiedUser,
            success: true,
            message: 'User verified successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while verifying user`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

async function verifyResend(req, res, next) {
    try {
        const user = res.locals.user;
        const token = await authService.verifyResend(user);

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while resending verification email`, err.message);

        return res.status(500).json({
            error: err.message,
            code: 500,
        });
    }
}

module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword,
    validateToken,
    logout,
    verify,
    verifyResend
}