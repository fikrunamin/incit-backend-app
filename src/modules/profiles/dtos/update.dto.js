class UpdateDto {
    constructor(name) {
        this.name = name;
    }

    static fromJson(json) {
        return new UpdateDto(json.name);
    }
}

module.exports = UpdateDto;