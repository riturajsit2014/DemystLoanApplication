'use strict';

const lastTwelveMonths = () => {
    const today = new Date();
    const lastTwelveMonths = [];
    for (let i = 0; i < 12; i++) {
        const month = today.getMonth() - i;
        const year = today.getFullYear();
        lastTwelveMonths.push({ month: month, year: year });
    }
    return lastTwelveMonths;
};

module.exports = {
    lastTwelveMonths: lastTwelveMonths,
};