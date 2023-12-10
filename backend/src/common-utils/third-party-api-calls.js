'use strict';

const axios = require('axios').default;
const consts = require('../backend-consts');

/**
 * This function makes a call to the third party API and returns the result
 * @param {String} url => API/Url to be called
 * @param {JSON} params => Params that need to be passed to the API/url
 * @param {String} type => Type of API call (GET/POST)
 */
const callThirdPartyAPI = async (url, params, type) => {
    try {
        const axiosConfig = {
            'method': type,
            'url': url,
        };

        if (type === consts.POST_API_CALL_TYPE) {
            axiosConfig.data = params;
        }
        const apiCallResult = await axios(axiosConfig);
        return apiCallResult.data;
    } catch (ex) {
        if (ex.response.status === 404) {
            throw new Error('LINK_NOT_FOUND');
        } else {
            throw ex;
        }
    }
};

const fetchBalanceSheetFromAccountingServer = async ( params ) => {
    const accountingServerUrl = process.env.ACCOUNTING_SOFTWARE_URL;
    return callThirdPartyAPI(accountingServerUrl, params, consts.POST_API_CALL_TYPE);
}

const callDecisionEngine = async ( params ) => {
    const decisionEngineUrl = process.env.DECISION_ENGINE_URL;
    return callThirdPartyAPI(decisionEngineUrl, params, consts.POST_API_CALL_TYPE);
}

module.exports = {
    fetchBalanceSheetFromAccountingServer: fetchBalanceSheetFromAccountingServer,
    callDecisionEngine: callDecisionEngine,
};
