require('./business/server.js');
console.log('\n\n');
 require('./FF/app.js');
console.log('\n\n');

process.env.NODE_CONFIG_DIR='./miscellaneous/project-mom-and-pop/config'
require('./miscellaneous/project-mom-and-pop/server.js');
console.log('\n\n');

var PORT1 = 3003;
var PORT2 = 10100;
var PORT3 = 3000;
var hostname = 'localhost';

var path = require('path');
var pathRegexp = require('path-to-regexp');
var express = require('express');
var _ = require('lodash');
var httpProxy = require('http-proxy');

var app = express();
var proxy = httpProxy.createProxyServer();

app.use(function (req, res, next) {
    var route = _.find([
        '/businesses/me',
        '/businesses/:id',
        '/businesses/:id/report',
        '/businesses/me/employees',
        '/businesses/me/employees',
        '/businesses/me/employees/:id',
        '/businesses/me/employees/:id',
        '/businesses/me',
        '/businesses/me/verify',
    ], function (route) {
        return pathRegexp(route).exec(req.path)
    });

    if (route) {
        return proxy.web(req, res, {
            target: {
                host: hostname,
                port: PORT1
            }
        });
    }

    route = _.find([
        '/offerCategories',
        '/actionTypes',
        '/feedbackTypes',
        '/businessTypes',
        '/feedbacks',
        '/abuses',
        '/invitations'
    ], function (route) {
        return pathRegexp(route).exec(req.path)
    });

    if (route) {
        return proxy.web(req, res, {
            target: {
                host: hostname,
                port: PORT2
            }
        });
    }

    route = _.find([
        '/register',
        '/login',
        '/forgotPassword',
        '/giftCardOffers/:id',
        '/users/me/giftCards/:id',
        '/giftCardOffers',
        '/users/me/giftCards',
        '/users/me/giftCards/:id/resell',
        '/users/me/giftCards/:id/prepareForRedeem',
        '/giftCards/redeem',
        '/users/me/actions',
        '/users/me/actionRecords',
        '/resetPassword',
        '/users/me',
        '/users/:id',
        '/revokeToken',
        '/users/me',
        '/giftCards',
        '/giftCardOffers',
        '/giftCardOffers/:id',
        '/giftCardOffers/:id',
        '/giftCardOffers/:id/cancel',
        '/giftCardOffers/:id/owners',
        '/giftCardOffers/:id/comments',
        '/giftCardOffers/:id/comments',
        '/giftCardOffers/:id/comments/:commentId'
    ], function (route) {
        return pathRegexp(route).exec(req.path)
    });

    if (route) {
        return proxy.web(req, res, {
            target: {
                host: hostname,
                port: PORT3
            }
        });
    }

    next();
})

app.use(express.static( path.join(__dirname, '../build')) );
app.listen(8000);
