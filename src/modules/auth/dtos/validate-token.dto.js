class ValidateTokenDto
{
    constructor(token) {
        this.token = token;
    }

    static fromJson(json) {
        return new ValidateTokenDto(json.token);
    }
}

module.exports = ValidateTokenDto;