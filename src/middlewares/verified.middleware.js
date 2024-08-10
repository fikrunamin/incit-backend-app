const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function auth(req, res, next) {
    try {
        const userId = res.locals.user?.id;

        if(!userId) {
            throw new Error('Unauthenticated. User not found');
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if(!user) {
            throw new Error('Unauthenticated. User not found');
        }

        if(!user.email_verified_at && !user.facebook_id && !user.google_id) {
            throw new Error('Unauthenticated. User not verified');
        }

        next();
    } catch (err) {
        console.error(`Error while verifying user`, err.message);

        return res.status(403).json({
            error: true,
            message: err.message,
            code: 403
        });
    }
}

module.exports = auth;