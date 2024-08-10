const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const bcrypt = require('bcrypt');

async function fetchById(id) {
    const user = await prisma.user.findFirst({
        where: {id}
    });

    delete user.password;
    return user;
}

async function update(user, dto) {
    return prisma.user.update({
        omit: {
            password: true
        },
        where: {
            id: user.id
        },
        data: {
            name: dto.name
        }
    });
}

async function updatePassword(user, dto) {
    user = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (!(await bcrypt.compare(dto.current_password, user.password))) {
        throw new Error('Invalid current password. Cannot proceed to change password');
    }

    return prisma.user.update({
        omit: {
            password: true
        },
        where: {
            id: user.id
        },
        data: {
            password: await bcrypt.hash(dto.password, SALT_ROUNDS)
        }
    });
}

module.exports = {
    fetchById,
    update,
    updatePassword
};