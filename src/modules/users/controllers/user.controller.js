const userService = require('../services/user.service');

async function index(req, res, next) {
    try {
        const users = await userService.fetchAll();

        res.status(200).json({
            data: users,
            success: true,
            message: 'Users fetched successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while fetching users`, err.message);
        next(err);
    }
}

module.exports = {
    index
};