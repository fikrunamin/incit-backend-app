const statService = require('../services/stat.service');

async function summary(req, res, next) {
    try {
        const summary = await statService.summary();

        res.status(200).json({
            data: summary,
            success: true,
            message: 'Stats summary fetched successfully',
            code: 200
        });
    } catch (err) {
        console.error(`Error while fetching stats summary`, err.message);
        next(err);
    }
}

module.exports = {
    summary
};