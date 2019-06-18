const uuid = require('uuid/v4');

const internal = {};

module.exports = internal.User = class User {
    constructor(data) {
        this.id = uuid();
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.user_name = data.user_name;
        this.password = data.password;
        this.phone = data.phone || null;
        this.address = data.address || null;
        this.active_loans = [];
        this.active_loans_count = 0;
    }
};
