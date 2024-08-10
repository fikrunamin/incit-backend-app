const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const dayjs = require("dayjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendVerificationEmail(user, token) {
    try {
        const url = `${process.env.CLIENT_APP_URL}/verify?token=${token}`;
        const email = await transport.sendMail({
            from: process.env.SMTP_MAIL_FROM,
            to: user.email,
            subject: 'Verify your email',
            html: `Please verify your email by clicking on this link: <a href="${url}">${url}</a>`,
        });

        console.log("Message sent: %s", email.messageId);

        return true;
    } catch (e) {
        console.error(e.message);
        return false;
    }
}

async function createUserAccessToken(user) {
    const token = await jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
    }, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});

    return prisma.userAccessToken.create({
        data: {
            user_id: user.id,
            expires_at: dayjs().add(30, 'days').toDate(),
            token,
        }
    });
}

async function createUserLoginLog(user) {
    return prisma.userLoginLog.create({
        data: {
            user_id: user.id
        }
    });
}

async function login(dto) {
    const user = await prisma.user.findFirst({
        where: {
            email: dto.email
        }
    });

    if (!user || !await bcrypt.compare(dto.password, user.password)) {
        throw new Error('Login failed. Invalid credentials');
    }

    const accessToken = await createUserAccessToken(user);

    await createUserLoginLog(user);

    delete user.password;
    return {
        user: {
            ...user,
            is_verified: Boolean(user.email_verified_at || user.facebook_id || user.google_id)
        }, access_token: accessToken.token
    };
}

async function register(dto) {
    let user = await prisma.user.findFirst({
        where: {
            email: dto.email
        }
    });

    if (user) {
        throw new Error(`User with email ${user.email} already exists`);
    }

    user = await prisma.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            password: await bcrypt.hash(dto.password, SALT_ROUNDS),
        }
    });

    await verifyResend(user);

    delete user.password;
    return user;
}

async function forgotPassword(dto) {
    const user = await prisma.user.findFirst({
        include: {
            resetPasswordToken: {
                where: {
                    expires_at: {
                        gte: dayjs().toDate(),
                    }
                }
            }
        },
        where: {
            email: dto.email
        }
    });

    if (user && !user.resetPasswordToken.length) {
        await prisma.resetPasswordToken.create({
            data: {
                user_id: user.id,
                token: uuid.v6(),
                expires_at: dayjs().add(2, 'hours').toDate(),
            }
        })

        console.log('Sending password reset email...');
    }

    return user;
}

async function resetPassword(dto) {
    const resetPasswordToken = await prisma.resetPasswordToken.findFirst({
        where: {
            token: dto.token,
        }
    });

    if (!resetPasswordToken) {
        throw new Error('Invalid reset password token. Cannot proceed to change password');
    }

    const user = await prisma.user.update({
        where: {
            id: resetPasswordToken.user_id
        },
        data: {
            password: await bcrypt.hash(dto.password, SALT_ROUNDS)
        }
    });

    await prisma.resetPasswordToken.delete({
        where: {
            id: resetPasswordToken.id
        }
    });

    delete user.password;
    return user;
}

async function validateToken(dto) {
    const token = await prisma.userAccessToken.findFirst({
        include: {
            user: {
                omit: {
                    password: true
                }
            }
        },
        where: {
            token: dto.token,
            deleted_at: null
        }
    });

    return {
        access_token: token.token, user: {
            ...token.user,
            is_verified: Boolean(token.user.email_verified_at || token.user.facebook_id || token.user.google_id)
        }
    };
}

async function logout(token) {
    try {
        await prisma.userAccessToken.update({
            where: {
                token
            },
            data: {
                deleted_at: new Date()
            }
        });
    } catch (e) {
        return true;
    }

    return true;
}

async function verify(user, dto) {
    const emailVerificationToken = await prisma.emailVerificationToken.findFirst({
        include: {
            user: {
                omit: {
                    password: true,
                }
            },
        },
        where: {
            user_id: user.id,
            token: dto.token
        }
    });

    if (!emailVerificationToken) {
        throw new Error('Invalid verification token');
    }

    return prisma.user.update({
        where: {
            id: emailVerificationToken.user_id
        },
        data: {
            email_verified_at: new Date()
        }
    });
}

async function verifyResend(user) {
    if (user.email_verified_at || user.facebook_id || user.google_id) {
        throw new Error('User already verified');
    }

    let token = await prisma.emailVerificationToken.findFirst({
        where: {
            user_id: user.id
        }
    });

    if (!token) {
        token = await prisma.emailVerificationToken.create({
            data: {
                user_id: user.id,
                token: uuid.v6(),
            }
        })
    }

    const isSent = await sendVerificationEmail(user, token.token);

    if (!isSent) {
        throw new Error('Error while sending verification email');
    }

    return token;
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    validateToken,
    logout,
    verify,
    verifyResend
}