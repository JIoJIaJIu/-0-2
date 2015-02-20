/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This service exports application security functionality.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

/* jshint camelcase: false */

/* Globals */

var SessionToken = require("../models/index").SessionToken;

var UserService = require('./UserService'),
    async = require('async');

var bcrypt = require('bcrypt-nodejs'),
    jwt = require('jwt-simple'),
    config = require("../configs/config"),
    winston = require('winston'),
    _ = require('underscore'),
    ValidationError = require('../errors/ValidationError'),
    ForbiddenError = require('../errors/ForbiddenError'),
    NotFoundError = require('../errors/NotFoundError');


var expirationDate;

var HTTP_RANGE = 400;

var request = require('request');

var socialNetworkTypes = {
    FACEBOOK: 'FACEBOOK',
    TWITTER: 'TWITTER',
    LINKEDIN: 'LINKEDIN'
};


/**
 * Implements the basic email/password based authentication
 *
 * @param  {String}       email         email address of user
 * @param  {String}       password      password of user
 * @param  {Function}     callback      callback function
 */
exports.authenticate = function(email, password, callback) {
    async.waterfall([
        function(cb) {
            UserService.getByEmail(email, cb);
        },
        function(user, cb) {
            if (user) {
                bcrypt.compare(password, user.passwordHash, function(err, result) {
                    if (err) {
                        cb(err);
                    } else if (result) {
                        cb(null, user);
                    } else {
                        cb(new ForbiddenError('user is not authenticated'));
                    }
                });
            } else {
                cb(new NotFoundError('User not found'));
            }
        }
    ], callback);
};

/**
 * Implements the social network authentication
 * NOTE: The access token should be a bearer access token
 *
 * @param  {String}       socialNetwork     name of social network
 * @param  {String}       accessToken       social network access token
 * @param  {Function}     callback          callback function
 */
var _authenticateWithSocialNetwork = exports.authenticateWithSocialNetwork = function(socialNetwork, accessToken, callback) {
    winston.info('Authenticating with social network ' + socialNetwork);
    if (socialNetwork === socialNetworkTypes.FACEBOOK) {
        request.get('https://graph.facebook.com/me', {
            'auth': {
                'bearer': accessToken
            }
        }, function(error, response, body) {
            if (error) {
                callback(error);
            } else if (response.statusCode < HTTP_RANGE) {
                var result = JSON.parse(body);
                callback(null, result);
            } else {
                var err = JSON.parse(body);
                callback(err);
            }
        });
    } else if (socialNetwork === socialNetworkTypes.TWITTER) {
        request.get('https://api.twitter.com/1.1/account/verify_credentials.json', {
            'auth': {
                'bearer': accessToken
            }
        }, function(error, response, body) {
            if (error) {
                callback(error);
            } else if (response.statusCode < HTTP_RANGE) {
                var result = JSON.parse(body);
                callback(null, result);
            } else {
                var err = JSON.parse(body);
                callback(err);
            }
        });
    } else if (socialNetwork === socialNetworkTypes.LINKEDIN) {
        request.get('https://api.linkedin.com/v1/people/~?format=json', {
            'auth': {
                'bearer': accessToken
            }
        }, function(error, response, body) {
            if (error) {
                callback(error);
            } else if (response.statusCode < HTTP_RANGE) {
                var result = JSON.parse(body);
                callback(null, result);
            } else {
                var err = JSON.parse(body);
                callback(err);
            }
        });
    }
};

/**
 * Authenticate the user based on the bearer session token
 *
 * @param  {String}       token             session access token
 * @param  {Function}     callback          callback function
 */
exports.authenticateWithSessionToken = function(token, callback) {
    async.waterfall([
        function(cb) {
            SessionToken.findOne({
                token: token
            }, cb);
        },
        function(sessionToken, cb) {
            if (!sessionToken) {
                return cb(new ForbiddenError('Session Token not found'));
            }
            var decoded = jwt.decode(sessionToken.token, config.JWT_SECRET);
            if (decoded.expiration > Date.now()) {
                // get user by id
                UserService.get(sessionToken.userId, function(err, user) {
                    expirationDate = decoded.expiration;
                    cb(err, user);
                });
            } else {
                // token expired
                cb(new ForbiddenError('Session Token Expired'));
            }
        }
    ], function(err, user) {
        callback(err, user, expirationDate);
    });
};

/**
 * Generate the session token to be returned to client in case of login request
 *
 * @param  {String}       userId            userId of user to generate token for
 * @param  {Function}     callback          callback function
 */
exports.generateSessionToken = function(userId, callback) {
    var dateObj = new Date();
    var millis = dateObj.getTime() + config.SESSION_TOKEN_DURATION;
    var token = jwt.encode({
        expiration: millis
    }, config.JWT_SECRET);
    SessionToken.create({
        userId: userId,
        token: token,
        expirationDate: millis
    }, function(err, sessionToken) {
        if (err) {
            callback(err);
        } else {
            callback(null, sessionToken.token);
        }
    });
};

/**
 * Determine whether a user is authorized to access a particular resource or not
 *
 * @param  {String}       userId            userId of user to generate token for
 * @param  {String}       action            action requested
 * @param  {Function}     callback          callback function
 */
exports.isAuthorized = function(userId, action, callback) {
    async.waterfall([
        function(cb) {
            UserService.get(userId, cb);
        },
        function(user, cb) {
            // if user exists
            if (user) {
                var authorized = false;
                _.forEach(user.userRoles, function(role) {
                    var actions = config['ACTIONS_' + role.role].split(',');
                    if (_.indexOf(actions, action) !== -1) {
                        authorized = true;
                    }
                });
                cb(null, authorized);
            } else {
                cb(new NotFoundError('User not found'));
            }
        }
    ], callback);
};

/**
 * Update a user password
 *
 * @param  {String}       token            reset password token
 * @param  {String}       password         new password to set
 * @param  {Function}     callback         callback function
 */
exports.updatePassword = function(token, password, callback) {
    async.waterfall([
        function(cb) {
            // search user by resetPasswordToken and resetPasswordToken should not be expired
            UserService.findByFilterCriteria({
                resetPasswordToken: token,
                resetPasswordExpired: false
            }, cb);
        },
        function(user, cb) {
            if (user) {
                // generate the salt
                bcrypt.genSalt(config.SALT_WORK_FACTOR, function(err, salt) {
                    cb(err, user, salt);
                });
            } else {
                cb(new NotFoundError('User not found'));
            }
        },
        function(user, salt, cb) {
            // hash password
            bcrypt.hash(password, salt, null, function(err, hash) {
                cb(err, user, hash);
            });
        },
        function(user, hash, cb) {
            // update user
            _.extend(user, {
                passwordHash: hash,
                resetPasswordExpired: true,
                resetPasswordToken: undefined
            });
            user.save(cb);
        }
    ], callback);
};

/**
 * Get all the allowed actions for a user
 *
 * @param  {String}       userId           userId of user
 * @param  {Function}     callback         callback function
 */
exports.getAllowedActions = function(userId, callback) {
    async.waterfall([
        function(cb) {
            UserService.get(userId, cb);
        },
        function(user, cb) {
            var allowedActions = [];
            if (user) {
                _.forEach(user.userRoles, function(role) {
                    var actions = config['ACTIONS_' + role.role].split(',');
                    allowedActions = allowedActions.concat(actions);
                    cb(null, allowedActions);
                });
            } else {
                // user not found
                cb(new NotFoundError('User not found'));
            }
        }
    ], callback);
};

/**
 * Revoke a session token
 *
 * @param  {String}       userId           userId of user
 * @param  {String}       token            session token to revoke
 * @param  {Function}     callback         callback function
 */
exports.revokeSessionToken = function(userId, token, callback) {
    SessionToken.findOne({
        userId: userId,
        token: token
    }, function(err, sessionToken) {
        if (err) {
            return callback(err);
        } else if (!sessionToken) {
            return callback(new NotFoundError('Session Token not found'));
        } else {
            sessionToken.remove(callback);
        }
    });
};

/**
 * Generate a hash of the given plainText string
 *
 * @param  {String}       plainText        plainText string
 * @param  {Function}     callback         callback function
 */
exports.generateHash = function(plainText, callback) {
    async.waterfall([
        function(cb) {
            bcrypt.genSalt(config.SALT_WORK_FACTOR, cb);
        },
        function(salt, cb) {
            bcrypt.hash(plainText, salt, null, cb);
        }
    ], callback);
};

/**
 * Get a user profile from the social network
 * This function is added for registration functionality.
 * This function uses _authenticateWithSocialNetwork to first authenticate the user before fetching the profile
 *
 * @param  {String}       socialNetwork    social network name
 * @param  {String}       accessToken      social network access token
 * @param  {Function}     callback         callback function
 */
exports.getSocialNetworkProfile = function(socialNetwork, accessToken, callback) {
    var profile;
    async.waterfall([
        function(cb) {
            winston.info('Fetching social network profile');
            _authenticateWithSocialNetwork(socialNetwork, accessToken, cb);
        },
        function(result, cb) {
            if (socialNetwork === socialNetworkTypes.FACEBOOK) {
                profile = {
                    email: result.email,
                    firstName: result.first_name,
                    lastName: result.last_name,
                    linkedSocialNetwork: socialNetwork,
                    linkedSocialNetworkUserId: result.id
                };
                cb(null, profile);
            } else if (socialNetwork === socialNetworkTypes.TWITTER) {
                profile = {
                    firstName: result.screen_name,
                    linkedSocialNetwork: socialNetwork,
                    linkedSocialNetworkUserId: result.id
                };
                cb(null, profile);
            } else if (socialNetwork === socialNetworkTypes.LINKEDIN) {
                profile = {
                    firstName: result['first-name'],
                    lastName: result['last-name'],
                    email: result['email-address'],
                    linkedSocialNetwork: socialNetwork,
                    linkedSocialNetworkUserId: result.id
                };
                cb(null, profile);
            } else {
                cb(new ValidationError('"' + socialNetwork + '" social network authenticaiton not supported'));
            }
        }
    ], callback);
};
