const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserFunctions = require('../controllers/user-controller');
const privateKey = require('../security/secret');


/*Create New User*/
router.post('/register', async (req, res, next) => {
    try {

        if (!req.body.user_name
            && !req.body.first_name
            && !req.body.last_name
            && !req.body.email
            && !req.body.password
            ) {
            res.status(406).json({error: 'fields marked important not provided!'})
        }
        const user = await UserFunctions.registerUser({
            user_name: req.body.user_name,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
            email: req.body.email
        });
        res.status(201).json({
            reg_status: 'registration successful',
            user
        });
    }
    catch (e) {
        res.status(400).json({error: e.message});
    }

});

/*User Login*/
router.post('/login', async (req, res, next) => {

  /*Return user-model.js bio data*/
    try {
        if (!req.body) {
            res.status(400).json({error: 'username and password not provided'});
        }
        const logged_in_user = await UserFunctions.userLogin({
            user_name: req.body.user_name,
            password: req.body.password
        });
        if (!logged_in_user) {
            res.status(404).json({error: 'No record associated with username ' + req.body.user_name + '.'})
        }
        console.log(privateKey);
        const token = jwt.sign({user: logged_in_user}, privateKey, {expiresIn: '1hr', noTimestamp: true, algorithm: 'HS384'});
        res.send({login: 'successful', token});
    }
    catch (e) {
        res.status(500).json({error: 'unable to login', trace: e.stack})
    }
});

/*Testing*/
router.get('', (req, res, next) => {
    res.send({status: 'welcome to lendsqr API!!!!'})
});


module.exports = router;
