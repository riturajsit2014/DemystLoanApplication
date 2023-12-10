'use strict';

const commonUtil = require('backend-common-utils');

const initiateLoanRequest = async () => {
    const requestDetails = ['name', 'address', 'loanAmount', 'loanType', 'yearOfEstablishment'];
    const requestDetailsKeysToNameMapping = {
        name: 'Name',
        address: 'Address',
        loanAmount: 'Loan Amount',
        loanType: 'Loan Type',
        yearOfEstablishment: 'Year of Establishment',
    };
    return { data: { keys: requestDetails, keysToNameMapping: requestDetailsKeysToNameMapping } };
};

const getBalanceSheet = async (loanRequestDetails) => {
    try {
        const balanceSheet = await commonUtil.fetchBalanceSheetFromAccountingServer(loanRequestDetails);
        return { data: { balanceSheet, loanRequestDetails } };
    } catch (ex) {
        console.log(ex.message);
        return { error: ex.message };
    }
}

const convertToObjectOfArraysByMonth = (balanceSheet) => {
    const balanceSheetByMonth = {};
    for (const obj of balanceSheet) {
        if (balanceSheetByMonth[obj.month]) {
            balanceSheetByMonth[obj.month].push(obj);
        } else {
            balanceSheetByMonth[obj.month] = [obj];
        }
    }
    return balanceSheetByMonth;
}

const applyRulesToSummariseApplication = (balanceSheet, loanAmount) => {
    let preAssessmentValue = 20;
    const lastTwelveMonths = commonUtil.lastTwelveMonths();
    const balanceSheetByMonth = convertToObjectOfArraysByMonth(balanceSheet);
    let netAssetValue = 0;
    let totalProfitOrLoss = 0;
    const yearWiseProfitOrLoss = {};
    for (const obj of lastTwelveMonths) {
        if (balanceSheetByMonth[obj.month]) {
            const monthBalanceSheet = balanceSheetByMonth[obj.month];
            const requiredMonthBalanceSheet = monthBalanceSheet.filter((sheet) => { return sheet.year === obj.year; });
            if (requiredMonthBalanceSheet) {
                netAssetValue += requiredMonthBalanceSheet[0].assetsValue;
                totalProfitOrLoss += requiredMonthBalanceSheet[0].profitOrLoss;
            }
        }
    }
    balanceSheet.forEach(record => {
        if(yearWiseProfitOrLoss[record.year]) {
            yearWiseProfitOrLoss[record.year] += record.profitOrLoss;
        } else {
            yearWiseProfitOrLoss[record.year] = record.profitOrLoss;
        }
    });
    const avgAssetValue = netAssetValue / 12;
    if (avgAssetValue > loanAmount) {
        preAssessmentValue = 100;
    } else if (totalProfitOrLoss > 0) {
        preAssessmentValue = 60;
    }
    return { preAssessmentValue, yearWiseProfitOrLoss };
};

const requestOutcomeFromDecisionEngine = async (loanRequestDetails) => {
    try {
        const balanceSheet = await commonUtil.fetchBalanceSheetFromAccountingServer(loanRequestDetails);
        const { preAssessmentValue, yearWiseProfitOrLoss } = applyRulesToSummariseApplication(balanceSheet, loanRequestDetails.loanAmount);
        const decisionEngineReqBody = {
            businessDetails: {
                name: loanRequestDetails.name,
                yearOfEstablishment: loanRequestDetails.yearOfEstablishment,
                summaryOfProfitOrLoss: yearWiseProfitOrLoss,
            },
            preAssessment: preAssessmentValue,
        };
        const decisionEngineResponse = await commonUtil.callDecisionEngine(decisionEngineReqBody);
        return { data: { decisionEngineResponse, loanRequestDetails } };
    } catch (ex) {
        console.log(ex.message);
        return { error: ex.message };
    }
}

module.exports = {
    getBalanceSheet: getBalanceSheet,
    initiateLoanRequest: initiateLoanRequest,
    requestOutcomeFromDecisionEngine: requestOutcomeFromDecisionEngine,
};
