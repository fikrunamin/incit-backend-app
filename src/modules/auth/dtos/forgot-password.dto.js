class ForgotPasswordDto
{
    constructor(email) {
        this.email = email;
    }

    static fromJson(json) {
        return new ForgotPasswordDto(json.email);
    }
}

module.exports = ForgotPasswordDto;