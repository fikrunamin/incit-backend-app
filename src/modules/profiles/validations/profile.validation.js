const z = require('zod');

function update(data) {

    const schema = z.object({
        name: z.string().min(3, 'Must have at least 3 characters'),
    });

    return schema.parse(data);
}

function updatePassword(data) {
    const passwordValidation = new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/
    );

    const schema = z.object({
        current_password: z.string()
            .min(1, 'Must have at least 1 character'),
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

module.exports = {
    update,
    updatePassword
}