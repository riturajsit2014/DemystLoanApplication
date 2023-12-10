'use strict';

const balanceSheetModule = require('../modules/get-balance-sheet');

const getBalanceSheet = (req) => {
    const balanceSheet = balanceSheetModule.getBalanceSheetData(req.body);
    return balanceSheet;
};

module.exports = {
    getBalanceSheet,
};
