const {PrismaClient} = require('@prisma/client');
const dayjs = require("dayjs");

const prisma = new PrismaClient();

async function summary() {
    const totalUsers = await prisma.user.count();

    const todayActiveSessions = await prisma.userLoginLog.count({
        where: {
            created_at: {
                gte: dayjs().startOf('day').toDate(),
                lte: dayjs().endOf('day').toDate()
            }
        }
    });

    const averageActiveSessionsLast7Days = await prisma.$queryRaw`
        SELECT 
            ROUND(AVG(stat.total_logs)) as avg 
        FROM (
            SELECT
                user_login_logs.*, DATE(user_login_logs.created_at) as date, COUNT(user_login_logs.id) as total_logs
            FROM
                user_login_logs
            GROUP BY
                id,
                date
            ORDER BY
                date DESC
            LIMIT
                7
        ) stat JOIN user_login_logs ull ON ull.id = stat.id
    `;

    return {
        totalUsers,
        todayActiveSessions,
        averageActiveSessionsLast7Days: Number(averageActiveSessionsLast7Days[0].avg)
    }
}

module.exports = {
    summary
};