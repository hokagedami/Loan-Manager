const uuid = require('uuid/v4');

const internal = {};

module.exports = internal.Loan = class {
    constructor(data) {
        this.id = uuid();
        this.name = data.name;
        this.description = data.description;
        this.interest_rate = data.interest_rate;
        this.amount = data.amount;
        this.tenure = data.tenure;
    }
};