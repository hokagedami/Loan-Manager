const LoanController = require('../models/loan-model');

const ren_money = new LoanController({
    name: 'Ren Money',
    description: 'Salary earners discounted loan',
    interest_rate: 3,
    amount: 50000,
    tenure: 30
});

const kia_kia = new LoanController({
    name: 'Kia Kia',
    description: 'Easy small loan',
    interest_rate: 5,
    amount: 5000,
    tenure: 3
});

const loans = [ren_money, kia_kia];


const getLoans = () => {
    return loans;
};

const getLoan = (loan_id) => {
    const loan_found = loans.filter((loan) => {
        return loan.id === loan_id;
    });
    return loan_found.length === 1 ? loan_found[0] : {error: `no loan with ID provided.`}
};
module.exports  = {
    getLoans,
    getLoan
};