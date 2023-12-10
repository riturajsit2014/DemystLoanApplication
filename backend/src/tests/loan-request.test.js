const commonUtil = require('backend-common-utils');
const loanRequestModule = require('../modules/loan-request');
const mockLoanRequestDetails = { 
    name: 'Test Company',
    address: 'Test Address',
    loanAmount: 100000,
    loanType: 'Term Loan',
    yearOfEstablishment: 2018,
 };
const mockBalanceSheet = [
    {
        "year": 2023,
        "month": 12,
        "profitOrLoss": 250000,
        "assetsValue": 1234
    },
    {
        "year": 2023,
        "month": 11,
        "profitOrLoss": 1150,
        "assetsValue": 5789
    },
    {
        "year": 2023,
        "month": 10,
        "profitOrLoss": 2500,
        "assetsValue": 22345
    },
    {
        "year": 2023,
        "month": 9,
        "profitOrLoss": -187000,
        "assetsValue": 223452
    },
    {
        "year": 2023,
        "month": 8,
        "profitOrLoss": 250000,
        "assetsValue": 1234
    },
    {
        "year": 2023,
        "month": 7,
        "profitOrLoss": 1150,
        "assetsValue": 5789
    },
    {
        "year": 2023,
        "month": 6,
        "profitOrLoss": 2500,
        "assetsValue": 22345
    },
    {
        "year": 2023,
        "month": 5,
        "profitOrLoss": -187000,
        "assetsValue": 223452
    },
    {
        "year": 2023,
        "month": 4,
        "profitOrLoss": 250000,
        "assetsValue": 1234
    },
    {
        "year": 2023,
        "month": 3,
        "profitOrLoss": 1150,
        "assetsValue": 5789
    },
    {
        "year": 2023,
        "month": 2,
        "profitOrLoss": 2500,
        "assetsValue": 22345
    },
    {
        "year": 2023,
        "month": 1,
        "profitOrLoss": -187000,
        "assetsValue": 223452
    },
    {
        "year": 2022,
        "month": 12,
        "profitOrLoss": -20000,
        "assetsValue": 1034
    },
];

describe('loanRequestModule', () => {
    describe('initiateLoanRequest', () => {
        it('should return the request details with keys and keysToNameMapping', async () => {
            const expectedRequestDetails = ['name', 'address', 'loanAmount', 'loanType', 'yearOfEstablishment'];
            const expectedRequestDetailsKeysToNameMapping = {
                name: 'Name',
                address: 'Address',
                loanAmount: 'Loan Amount',
                loanType: 'Loan Type',
                yearOfEstablishment: 'Year of Establishment',
            };

            const result = await loanRequestModule.initiateLoanRequest();

            expect(result).toEqual({ data: { keys: expectedRequestDetails, keysToNameMapping: expectedRequestDetailsKeysToNameMapping } });
        });
    });

    describe('getBalanceSheet', () => {
        it('should return the balance sheet and loan request details', async () => {
            

            commonUtil.fetchBalanceSheetFromAccountingServer = jest.fn().mockResolvedValue(mockBalanceSheet);

            const result = await loanRequestModule.getBalanceSheet(mockLoanRequestDetails);

            expect(commonUtil.fetchBalanceSheetFromAccountingServer).toHaveBeenCalledWith(mockLoanRequestDetails);
            expect(result).toEqual({ data: { balanceSheet: mockBalanceSheet, loanRequestDetails: mockLoanRequestDetails } });
        });

        it('should return an error message if an exception is thrown', async () => {
            const mockErrorMessage = 'An error occurred';
            commonUtil.fetchBalanceSheetFromAccountingServer = jest.fn().mockRejectedValue(new Error(mockErrorMessage));

            const result = await loanRequestModule.getBalanceSheet(mockLoanRequestDetails);

            expect(commonUtil.fetchBalanceSheetFromAccountingServer).toHaveBeenCalledWith(mockLoanRequestDetails);
            expect(result).toEqual({ error: mockErrorMessage });
        });
    });

    describe('requestOutcomeFromDecisionEngine', () => {
        it('should return the decision engine response and loan request details', async () => {
            const mockPreAssessmentValue = 20;
            const mockYearWiseProfitOrLoss = { 2022: -20000, 2023: 199950, };
            const mockDecisionEngineResponse = {decision: 'Approved'};
            commonUtil.fetchBalanceSheetFromAccountingServer = jest.fn().mockResolvedValue(mockBalanceSheet);
            commonUtil.callDecisionEngine = jest.fn().mockResolvedValue(mockDecisionEngineResponse);

            const result = await loanRequestModule.requestOutcomeFromDecisionEngine(mockLoanRequestDetails);

            expect(commonUtil.fetchBalanceSheetFromAccountingServer).toHaveBeenCalledWith(mockLoanRequestDetails);
            expect(commonUtil.callDecisionEngine).toHaveBeenCalledWith({
                businessDetails: {
                    name: mockLoanRequestDetails.name,
                    yearOfEstablishment: mockLoanRequestDetails.yearOfEstablishment,
                    summaryOfProfitOrLoss: mockYearWiseProfitOrLoss,
                },
                preAssessment: mockPreAssessmentValue,
            });
            expect(result).toEqual({ data: { decisionEngineResponse: mockDecisionEngineResponse, loanRequestDetails: mockLoanRequestDetails } });
        });

        it('should return an error message if an exception is thrown', async () => {
            const mockErrorMessage = 'An error occurred';
            commonUtil.fetchBalanceSheetFromAccountingServer = jest.fn().mockRejectedValue(new Error(mockErrorMessage));

            const result = await loanRequestModule.requestOutcomeFromDecisionEngine(mockLoanRequestDetails);

            expect(commonUtil.fetchBalanceSheetFromAccountingServer).toHaveBeenCalledWith(mockLoanRequestDetails);
            expect(result).toEqual({ error: mockErrorMessage });
        });
    });
});