'use strict';

const decisionModule = require('../modules/decision');

const getDecision = (req) => {
    const decision = decisionModule.decisionMade(req.body);
    return decision;
};

module.exports = { 
    getDecision,
};
