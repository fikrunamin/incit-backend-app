const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function guest(req, res, next) {
    try {
        const token = req.get('Authorization')?.replace('Bearer ', '');

        if(token) {
            throw new Error('Only authenticated users can access. Please log out and try again.');
        }

        next();
    } catch (err) {
        console.error(`Only authenticated users can access:`, err.message);

        return res.status(403).json({
            error: true,
            message: err.message,
            code: 400
        });
    }
}

module.exports = guest;