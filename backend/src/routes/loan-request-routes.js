var express = require('express');
var router = express.Router();
const loanRequestController = require('../controllers/loan-request-controller');

router.post('/application/start', async function(req, res, next) {
    const startApplicationRes = await loanRequestController.loanInitiate(req);
    // res.send(startApplicationRes);
    res.render('loan-form', { data: startApplicationRes.data });
});

router.post('/fetch-balance-sheet', async function(req, res, next) {
  const balanceSheet = await loanRequestController.getBalanceSheet(req);
  res.send(balanceSheet);
  // res.render('loan-form', { data: balanceSheet.data });
});

router.post('/application/submit', async function(req, res, next) {
  const loanApplicationOutcome = await loanRequestController.requestLoanApplicationOutcome(req);
  res.send(loanApplicationOutcome);
  // res.render('loan-form', { data: loanApplicationOutcome.data })
});

module.exports = router;
