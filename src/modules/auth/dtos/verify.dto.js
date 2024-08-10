class Verify
{
    constructor(token) {
        this.token = token;
    }

    static fromJson(json) {
        return new Verify(json.token);
    }
}

module.exports = Verify;