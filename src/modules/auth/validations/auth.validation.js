const z = require('zod');

function login(data) {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    });

    return schema.parse(data);
}

function register(data) {
    const passwordValidation = new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/
    );

    const schema = z.object({
        name: z.string().min(3, 'Must have at least 3 characters'),
        email: z.string().email(),
        password: z.string()
            .min(1, 'Must have at least 1 character')
            .regex(passwordValidation, {
                message: 'Your password is not valid',
            }),
        confirm_password: z.string()
    }).superRefine((data, ctx) => {
        if(data.password !== data.confirm_password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Password does not match',
                path: ['confirm_password']
            })
        }
    });

    return schema.parse(data);
}

function forgotPassword(data) {
    const schema = z.object({
        email: z.string().email()
    });

    return schema.parse(data);
}

function resetPassword(data) {
    const passwordValidation = new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/
    );

    const schema = z.object({
        token: z.string(),
        password: z.string()
            .min(1, 'Must have at least 1 character')
            .regex(passwordValidation, {
                message: 'Your password is not valid',
            }),
        confirm_password: z.string()
    }).superRefine((data, ctx) => {
        if(data.password !== data.confirm_password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Password does not match',
                path: ['confirm_password']
            })
        }
    });

    return schema.parse(data);
}

function validateToken(data) {
    const schema = z.object({
        token: z.string()
    });

    return schema.parse(data);
}

function verify(data) {
    const schema = z.object({
        token: z.string()
    });

    return schema.parse(data);
}

module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword,
    validateToken,
    verify
}