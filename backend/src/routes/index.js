'use strict';

const indexRoutes = require('./index-routes');
const loanRequestRoutes = require('./loan-request-routes');

const apis = (app) => {
    app.use('/', indexRoutes);
    app.use('/loan', loanRequestRoutes);
};


module.exports = apis;
