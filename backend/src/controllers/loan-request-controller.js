'use strict';

const loanRequestModule = require('../modules/loan-request');

const loanInitiate = async(req) => {
    const loanInitiateData = req.body;
    return loanRequestModule.initiateLoanRequest(loanInitiateData);
};

const getBalanceSheet = async(req) => {
    const getBalanceSheetData = req.body;
    return loanRequestModule.getBalanceSheet(getBalanceSheetData);
};

const requestLoanApplicationOutcome = async(req) => {
    const loanRequestData = req.body;
    return loanRequestModule.requestOutcomeFromDecisionEngine(loanRequestData);
};

module.exports = {
    loanInitiate: loanInitiate,
    getBalanceSheet: getBalanceSheet,
    requestLoanApplicationOutcome: requestLoanApplicationOutcome,
};
