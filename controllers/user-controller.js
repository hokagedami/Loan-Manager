const UserController = require('../models/user-model');
const bcrypt = require('bcrypt');
const saltRounds = 10;


let users = [];

const registerUser = async (user_data) => {
    if (!user_data
        && !user_data.first_name
        && !user_data.last_name
        && !user_data.email
        && !user_data.password
        && !user_data.user_name) {
        throw Error('all fields must be provided!');
    }

    if (users.filter((user) => { return user.user_name === user_data.user_name}).length > 0) {
        throw Error('an account is already registered with username ' + user_data.user_name);
    }

    if (users.filter((user) => { return user.email === user_data.email}).length > 0) {
        throw Error('an account is already registered with email ' + user_data.email);
    }

    const hash = await bcrypt.hash(user_data.password, saltRounds);
    const user = new UserController({
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        email: user_data.email,
        password: hash,
        user_name: user_data.user_name
    });
    users.push(user);
    return user;
};

const userLogin = async (login_data) => {
    if (!login_data
        && !login_data.user_name
        && !login_data.password) {
        throw Error('username and password must be provided!');
    }

    const logged_in_user = users.filter(async (user) => {
        return await bcrypt.compare(login_data.password, user.password);
    });

    if (logged_in_user.length === 1) {
        const user_bio_data = {};
        Object.assign(user_bio_data, logged_in_user[0]);
        delete user_bio_data.password;
        return user_bio_data;
    }
    return null;
};

const addLoan = (user_id, loan_data) => {
    const user = users.filter((user) => {return user.id === user_id});
    if (user.length === 1) {
        const new_user = user[0];
        new_user.active_loans.push(loan_data);
        new_user.active_loans_count = ++new_user.active_loans_count;
        users = users.filter((user) => {
            return user.id !== user_id;
        });
        users.push(new_user);
        return users;
    }
    return user;


};


module.exports = {registerUser, userLogin, addLoan};