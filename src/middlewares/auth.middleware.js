const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function auth(req, res, next) {
    try {
        const token = req.get('Authorization')?.replace('Bearer ', '');

        if(!token) {
            throw new Error('Unauthenticated. Access token not found');
        }

        const accessToken = await prisma.userAccessToken.findFirst({
            include: {
                user: true
            },
            where: {
                token
            }
        });

        if(!accessToken || accessToken.deleted_at) {
            throw new Error('Invalid access token');
        }

        res.locals.user = accessToken.user;
        next();
    } catch (err) {
        console.error(`Access token invalid`, err.message);

        return res.status(403).json({
            error: true,
            message: err.message,
            code: 403
        });
    }
}

module.exports = auth;