class UpdatePasswordDto {
    constructor(current_password, password) {
        this.current_password = current_password;
        this.password = password;
    }

    static fromJson(json) {
        return new UpdatePasswordDto(
            json.current_password,
            json.password
        );
    }
}

module.exports = UpdatePasswordDto;