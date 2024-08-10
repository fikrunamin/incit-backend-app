const jwt = require('jsonwebtoken');
const profileService = require('../services/profile.service');
const profileValidation = require('../validations/profile.validation');
const profileDto = require('../dtos/profile.dto');

async function show(req, res, next) {
    try {
        const user = res.locals.user;
        const profile = await profileService.fetchById(user.id);

        res.status(200).json({
            data: profile,
            success: true,
            message: 'User profile fetched successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while fetching user profile`, err.message);
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const user = res.locals.user;
        const data = profileValidation.update(req.body);
        const dto = profileDto.update.fromJson(data);
        const updatedUser = await profileService.update(user, dto);

        return res.status(200).json({
            data: updatedUser,
            success: true,
            message: 'User profile updated successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while updating user profile`, err.message);
        next(err);
    }
}

async function updatePassword(req, res, next) {
    try {
        const user = res.locals.user;
        const data = profileValidation.updatePassword(req.body);
        const dto = profileDto.updatePassword.fromJson(data);
        const updatedUser = await profileService.updatePassword(user, dto);

        return res.status(200).json({
            data: updatedUser,
            success: true,
            message: 'User password updated successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while updating user password`, err.message);
        next(err);
    }
}

module.exports = {
    show,
    update,
    updatePassword
}