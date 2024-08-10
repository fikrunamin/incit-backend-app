class ResetPasswordDto
{
    constructor(token, password) {
        this.token = token;
        this.password = password;
    }

    static fromJson(json) {
        return new ResetPasswordDto(json.token, json.password);
    }
}

module.exports = ResetPasswordDto;