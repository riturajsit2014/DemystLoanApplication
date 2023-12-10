'use strict';

const decisionMade = (inputData) => {
    console.log('Input Data Recieved: ', inputData);
    return {decision: 'Approved'};
};

module.exports = {
    decisionMade,
};
