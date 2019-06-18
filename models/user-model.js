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
        this.phone = data.phone;
        this.address = data.address;
        this.active_loans = [];
        this.active_loan_start = data.active_loan_start;
        this.active_loan_end = data.active_loan_end;
        this.active_loans_count = 0;
    }
};
