class RegisterDto {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static fromJson(json) {
        return new RegisterDto(json.name, json.email, json.password);
    }
}

module.exports = RegisterDto;