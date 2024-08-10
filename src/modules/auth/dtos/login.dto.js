class LoginDto {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    static fromJson(json) {
        return new LoginDto(json.email, json.password);
    }
}

module.exports = LoginDto;