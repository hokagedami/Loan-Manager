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
        jwt.verify(req.token, privateKey, (err) => {
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
router.post('/apply/:loanID', VerifyToken, (req, res) => {
    try {
        jwt.verify(req.token, privateKey, (err, user_bio_data) => {
            if (err) {
                res.status(403).json({error: err.message});
            }
            const loan_to_apply = LoanController.getLoan(req.params.loanID);
            if (loan_to_apply.error) {
                res.status(404).json({error: `loan with ID: ${req.params.loanID} not found!`});
                return;
            }
            console.log(loan_to_apply);
            const user_loan_application = UserController.addLoan(user_bio_data.user.id, loan_to_apply);
            if (!user_loan_application.error) {

                res.send({loan_application: 'successful', user_loan_application});
                return;
            }
            res.status(400).json({error: user_loan_application.error});
        });
    }
    catch (e) {
        res.status(503).json({error: e.message});
    }
});

module.exports = router;


//console.log(loan);