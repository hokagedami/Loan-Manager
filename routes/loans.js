const express = require('express');
const LoanController = require('../controllers/loan-controller');
const UserController = require('../controllers/user-controller');
const VerifyToken = require('../security/verify-token');
const jwt = require('jsonwebtoken');
const privateKey = require('../security/secret');
const router = express.Router();

/*Get all loans available*/
router.get('', VerifyToken, (req, res, next) => {
    try {
        jwt.verify(req.token, privateKey, (err, user_bio_data) => {
            if (err) {
                res.status(403).json({error: err.message});
            }
            res.send(LoanController.getLoans());
        });
    }
     catch (e) {
      res.status(503).json({error: e.message});
     }
});

/*Apply for a loan*/
router.post('/apply', VerifyToken, (req, res, next) => {
    try {
        jwt.verify(req.token, privateKey, (err, user_bio_data) => {
            if (err) {
                res.status(403).json({error: err.message});
            }
            const loan_to_apply = LoanController.getLoan(req.body.loanID);
            console.log(user_bio_data);
            res.send(UserController.addLoan(user_bio_data.user.id, loan_to_apply));
        });
    }
    catch (e) {
        res.status(503).json({error: e.message});
    }
});

module.exports = router;


//console.log(loan);