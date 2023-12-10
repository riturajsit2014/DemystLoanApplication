'use strict';

const indexRoutes = require('./index-routes');

const apis = (app) => {
    app.use('/', indexRoutes);
};


module.exports = apis;
