const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchAll() {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        },
        include: {
            _count: {
                select: {
                    userAccessToken: true
                }
            },
            userAccessToken: {
                select: {
                    id: true,
                    deleted_at: true
                },
                orderBy: {
                    deleted_at: 'desc',
                },
                take: 1,
                where: {
                    NOT: {
                        deleted_at: null
                    }
                }
            }
        },
    });

    return users.map(user => {
        const {userAccessToken, ...rest} = user;

        return {
            ...rest,
            _count: undefined,
            loginAttempts: user._count.userAccessToken,
            lastLogoutAttempt: userAccessToken.length ? userAccessToken[0].deleted_at : null,
        }
    });
}

module.exports = {
    fetchAll
};