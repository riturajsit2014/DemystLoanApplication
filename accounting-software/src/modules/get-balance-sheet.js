'use strict';

const sampleSheetData = require('../data/sample-sheet.json');

const getBalanceSheetData = (companyData) => {
    console.log('Received companyData:::: ', companyData);
    return sampleSheetData.sheet;
};

module.exports = {
    getBalanceSheetData,
};
