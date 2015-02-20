/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application auth middleware.
 * This middleware authorizes the user of given operation
 * This middleware is added after tokenParser.
 * This middleware is added only for secured routes
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

/* Globals */
var UnauthorizedError = require('../errors/UnauthorizedError');
var ForbiddenError = require('../errors/ForbiddenError');
var SecurityService = require('../services/SecurityService');
var logResponseAndError = require("../helpers/logging").logResponseAndError;
var authorizationTypes = {
    Basic: 'Basic',
    Bearer: 'Bearer'
};

function authenAction(action) {

    return function(req, res, next) {
        if (req.auth && req.auth.token) {
            if (req.auth.type === authorizationTypes.Basic) {
                // login route with social network authentication
                return next();
            }
            // get authorization token and authorize the user
            SecurityService.authenticateWithSessionToken(req.auth.token, function(err, user, expirationDate) {
                if (err) {
                    return logResponseAndError(err, res);
                } else {
                    SecurityService.isAuthorized(user, action, function(err, authorized) {
                        if (authorized) {
                            req.user = user;
                            res.header('Session-Expires-In', expirationDate - (new Date()).getTime());
                            next();
                        } else {
                            logResponseAndError(new UnauthorizedError('User is not authorized'), res);
                        }
                    });
                }
            });

        } else {
            logResponseAndError(new ForbiddenError('User is not authenticated'), res);
        }

    };
}

module.exports = authenAction;
