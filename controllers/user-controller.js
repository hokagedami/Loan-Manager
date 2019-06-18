const moment = require('moment');

const UserController = require('../models/user-model');
const bcrypt = require('bcrypt');
const saltRounds = 10;


let users = [];

const registerUser = async (user_data) => {
    // Ensure all required fields are provided.
    if ((user_data.first_name === undefined || user_data.first_name === '')
        || (user_data.last_name === undefined || user_data.last_name === '')
        || (user_data.email === undefined || user_data.email === '')
        || (user_data.password === undefined || user_data.password === '')
        || (user_data.user_name === undefined || user_data.user_name === '')) {
        throw Error('all required fields must be provided!');
    }

    // Check that username is not in use
    if (users.filter((user) => { return user.user_name === user_data.user_name}).length > 0) {
        throw Error('an account is already registered with username ' + user_data.user_name);
    }

    // Check that email is not in use
    if (users.filter((user) => { return user.email === user_data.email}).length > 0) {
        throw Error('an account is already registered with email ' + user_data.email);
    }

    const hash = await bcrypt.hash(user_data.password, saltRounds);
    const user = new UserController({
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        email: user_data.email,
        password: hash,
        user_name: user_data.user_name,
        phone: user_data.phone,
        address: user_data.address,
        active_loan_start: '',
        active_loan_end: ''
    });
    users.push(user);
    return user;
};

const userLogin = (login_data) => {

    if (login_data.user_name === undefined || login_data.user_name === ''
        || login_data.password === undefined || login_data.password === '') {
        throw Error('username and password must be provided!');
    }

    let user_bio_data = null;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.user_name === login_data.user_name) {
            user_bio_data = {};
            Object.assign(user_bio_data, user);
            break;
        }
    }
    if (user_bio_data) {
        const match = bcrypt.compareSync(login_data.password, user_bio_data.password);
        delete user_bio_data.password;
        return match ? user_bio_data : {error: 'incorrect password'};
    }
    return user_bio_data;
};

const addLoan = (user_id, loan_data) => {
    const user = users.filter((user) => {return user.id === user_id});
    if (user.length === 1 && !loan_data.error) {
        const new_user = user[0];
        const start_time = moment().format("DD-MMM-YYYY");
        const end_time = moment(start_time, "DD-MMM-YYYY").add(loan_data.tenure, 'months').format("DD-MMM-YYYY");
        if (new_user.active_loans_count > 0) {
            const additional_loan_eligibility = moment(start_time, "DD-MMM-YYYY").isSameOrAfter(moment(new_user.active_loan_end, "DD-MMM-YYYY"));
            if (!additional_loan_eligibility) {
                return {error: 'You are not eligible for this loan!'};
            }
        }
        new_user.active_loan_start = start_time;
        new_user.active_loan_end = end_time;
        new_user.active_loans.push(loan_data);
        new_user.active_loans_count = ++new_user.active_loans_count;
        users = users.filter((user) => {
            return user.id !== user_id;
        });
        users.push(new_user);
        return new_user;
    }
    return {error: 'an error occurred, kindly re-login to continue'};


};


module.exports = {registerUser, userLogin, addLoan};