/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * UserController
 * This controller exposes REST actions for user
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

/* Globals */
var winston = require('winston'),
    ValidationError = require('../errors/ValidationError'),
    UnauthorizedError = require('../errors/UnauthorizedError'),
    async = require('async'),
    _ = require('underscore'),
    path = require('path'),
    helper = require('../helpers/helper'),
    fse = require('fs-extra'),
    UserService = require('../services/UserService'),
    ActionRecordService = require('../services/ActionRecordService'),
    crypto = require('crypto'),
    NotificationService = require('../services/NotificationService'),
    config = require('../configs/config'),
    wrapExpress = require('../helpers/logging').wrapExpress,
    NotFoundError = require('../errors/NotFoundError'),
    SecurityService = require('../services/SecurityService'),
    BusinessService = require('../services/BusinessService');


/**
 * Currently supported authentication types
 * @type {Object}
 */
var authenticationTypes = {
    password: 'password',
    facebook: 'facebook',
    twitter: 'twitter',
    linkedIn: 'linkedIn'
};

var accountTypes = {
    FOUNDER: 'FOUNDER',
    CHAMPION: 'CHAMPION'
};

var userRoles = {
    BUSINESS_ADMIN: 'BUSINESS_ADMIN',
    BUSINESS_EMPLOYEE: 'BUSINESS_EMPLOYEE',
    INDIVIDUAL_USER: 'INDIVIDUAL_USER'
};

/**
 * Route handler for POST /login
 * Login function.
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
function login(req, callback) {
    var type = req.query.type,
        auth = req.auth;
    if (type) {
        type = type.toLowerCase();
    }
    if (!authenticationTypes[type]) {
        // authentication type not supported
        callback(new ValidationError('Authentication "' + type + '" not supported'));
    }
    if (!auth) {
        // if authorization header not present, respond with HTTP 401 status code
        callback(new UnauthorizedError('User is not authorized'));
    }

    if (type === authenticationTypes.password) {
        async.waterfall([
            function(callback) {
                SecurityService.authenticate(auth.credentials.username, auth.credentials.password, callback);
            },
            function(user, callback) {
                SecurityService.generateSessionToken(user._id, callback);
            }
        ], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, {
                    sessionToken: result
                });
            }
        });
    } else if (type === authenticationTypes.facebook || type === authenticationTypes.twitter || type === authenticationTypes.linkedIn) {
        // call securityService authenticate with social network
        async.waterfall([
            function(cb) {
                var token = req.auth.token,
                    error = helper.checkString(token, 'Access Token');
                if (error) {
                    return cb(error, null);
                }
                SecurityService.authenticateWithSocialNetwork(type, token, cb);
            },
            function(result, cb) {
                UserService.getBySocialNetwork(type, result.id, cb);
            },
            function(user, cb) {
                SecurityService.generateSessionToken(user._id, cb);
            }
        ], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, {
                    sessionToken: result
                });
            }

        });
    }
}

/**
 * Parses the profile and business image information from registration resource object and save the images to PROFILE_IMAGE_DIRECTORY
 *
 * @param  {Object}     req                   The request
 * @param  {Object}     user                  The user
 * @param  {Object}     businessEntity        The business entity
 * @param  {Function}   callback              Callback function
 */
var _mapProfileImages = function(req, user, businessEntity, callback) {
    var profileImage = req.files.profileImage;
    var businessImage = req.files.businessImage;
    async.waterfall([
        function(cb) {
            if (user && profileImage) {
                var name = profileImage.name + Date.now();
                var movePath = path.join(config.PROFILE_IMAGE_FOLDER, name);
                user.picture = movePath;
                fse.move(profileImage.path, movePath, cb);
            } else {
                cb();
            }
        },
        function(cb) {
            if (businessImage && businessEntity) {
                var businessImageName = businessImage.name + Date.now();
                var businessMovePath = path.join(config.PROFILE_IMAGE_FOLDER, businessImageName);
                businessEntity.picture = businessMovePath;
                fse.move(businessImage.path, businessMovePath);
            } else {
                cb();
            }
        }
    ], function(err) {
        callback(err);
    });
};

/**
 * Parses the business information in registration resource object.
 *
 * @param  {Object}     registration          The object to extract information from
 * @param  {Function}   callback              Callback function
 */
var _mapBusinessEntity = function(registration) {
    var result = {
        name: registration.business.name,
        type: registration.business.type,
        description: registration.business.description,
        telephoneNumber: registration.business.telephoneNumber,
        address: registration.business.address,
        businessHours: registration.business.businessHours,
        isNamePublic: true,
        isTypePublic: true,
        isAddressPublic: true,
        isPicturePublic: true,
        isDescriptionPublic: true,
        isBusinessHoursPublic: true,
        isWebsitePublic: true,
        isVerified: true,
        isSubscriptionExpired: true,
        isTelephoneNumberPublic: true
    };
    return result;
};

/**
 * Parses the additional user information in registration resource object and return array of user resource
 *
 * @param  {Object}     user          The object to extract information from
 * @param  {Function}   callback      Callback function
 */
var _mapAdditionalUser = function(user, callback) {
    var result = {};
    result = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };
    SecurityService.generateHash(user.password, function(err, hash) {
        if (err) {
            callback(err);
        } else {
            result.passwordHash = hash;
            callback(null, result);
        }
    });
};

/**
 * Helper method to create a user
 *
 * @param  {Object}   user     The user
 * @param  {Function} callback Callback function
 */
var _createUser = function(user, callback) {
    UserService.create(user, callback);
};

/**
 * Helper method to validate registration resource
 * @param  {Object}   registration     The object to extract information from
 * @return {Error}    If validation failed otherwise undefined
 */
var _validateRegistration = function(registration) {
    var error, accountType = registration.accountType;
    if (!accountTypes[accountType]) {
        return new ValidationError('Account type is invalid');
    }
    if (registration.linkedSocialNetwork) {
        error = helper.checkString(registration.linkedSocialNetworkAccessToken, 'Access Token') || helper.checkDefined(registration.business, 'Business');
    } else {
        error = helper.checkString(registration.firstName, 'First Name') || helper.checkString(registration.lastName, 'Last Name') ||
            helper.checkEmail(registration.email, 'Email') || helper.checkString(registration.password, 'Password');
    }
    return error;
};

/**
 * Route handler for POST /register
 * Register function.
 * It creates the user resource
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   callback    callback function
 */
function registerUser(req, callback) {
    var businessEntity, additionalUsers = [];

    if (req.fields && req.fields.registration) {
        var registration = JSON.parse(req.fields.registration);
        var error = _validateRegistration(registration);
        if (error) {
            callback(error);
        }
        if (registration.linkedSocialNetwork) {
            if (!registration.linkedSocialNetworkAccessToken) {
                callback(new ValidationError('Social Network Access Token is mandatory'));
            }
            SecurityService.getSocialNetworkProfile(registration.linkedSocialNetwork, registration.linkedSocialNetworkAccessToken, function(err, profile) {
                if (err) {
                    callback(err);
                } else {
                    var role;
                    if (registration.accountType === accountTypes.CHAMPION) {
                        role = userRoles.INDIVIDUAL_USER;
                    } else if (registration.accountType === accountTypes.FOUNDER) {
                        role = userRoles.BUSINESS_ADMIN;
                    }
                    profile.userRoles = [{
                        businessId: registration.business.id,
                        role: role
                    }];
                    profile.isFirstNamePublic = true;
                    profile.isLastNamePublic = true;
                    profile.isEmailPublic = true;
                    profile.isLocationPublic = true;
                    profile.isPicturePublic = true;
                    profile.interestedOfferCategory = registration.interestedOfferCategory;
                    UserService.create(profile, function(err, createdUser) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, createdUser.toJSON(), helper.HTTP_CREATED);
                        }
                    });
                }
            });
        } else {
            var user = {
                firstName: registration.firstName,
                lastName: registration.lastName,
                email: registration.email,
                interestedOfferCategory: registration.interestedOfferCategory,
                password: registration.password,
                isFirstNamePublic: true,
                isLastNamePublic: true,
                isEmailPublic: true,
                isLocationPublic: true,
                isPicturePublic: true
            };
            async.waterfall([
                function(cb) {
                    if (registration.accountType === accountTypes.CHAMPION) {
                        // individual user
                        user.userRoles = [{
                            businessId: registration.business.id,
                            role: userRoles.INDIVIDUAL_USER
                        }];
                    } else if (registration.accountType === accountTypes.FOUNDER) {
                        // business owner
                        user.userRoles = [{
                            businessId: registration.business.id,
                            role: userRoles.BUSINESS_ADMIN
                        }];
                        // create business
                        businessEntity = _mapBusinessEntity(registration);
                        // get business users (additionalUsers)
                        async.map(registration.additionalUsers, _mapAdditionalUser, function(err, users) {
                            if (err) {
                                callback(err);
                            }
                            additionalUsers = _.union([], users);
                        });
                    }
                    cb();
                },
                function(cb) {
                    // get user profile image and business image if available
                    _mapProfileImages(req, user, businessEntity, cb);
                },
                function(cb) {
                    // create additional users and business entity if defined
                    if (additionalUsers.length > 0) {
                        async.map(additionalUsers, _createUser, function(err) {
                            if (err) {
                                return cb(err);
                            } else if (businessEntity) {
                                winston.info('Additional Users created successfully');
                                BusinessService.create(businessEntity, cb);
                            } else {
                                // passing business as null.
                                cb(null, null);
                            }
                        });
                    } else {
                        // passing business as null
                        cb(null, null);
                    }
                },
                function(business, cb) {
                    if (business) {
                        winston.info('Business created successfully');
                    }
                    // save registered user
                    UserService.create(user, cb);
                }
            ], function(err, createdUser) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, createdUser.toJSON(), helper.HTTP_CREATED);
                }
            });
        }
    } else {
        // BAD REQUEST
        callback(new ValidationError('Registration is mandatory field'));
    }
}

/**
 * Route handler for GET /users/me/actions
 * This function returns the allowed actions for the user
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
 function getAllowedActions(req, callback) {
     // process request
     // The auth middleware will do the authentication and set the user
     async.waterfall([
         function(cb) {
             SecurityService.getAllowedActions(req.user._id, cb);
         }
     ], function(err, result) {
         if (err) {
             callback(err);
         } else {
             callback(null, result);
         }
     });
 }

/**
 * Route handler for GET /users/me/actionRecords
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
 function getActionRecords(req, callback) {
     // process request
     async.waterfall([
         function(cb) {
             var filter = _.pick(req.query, 'pageSize', 'pageNumber', 'sortBy', 'sortOrder', 'actionType');
             ActionRecordService.search(filter, cb);
         }
     ], function(err, result) {
         if (err) {
             callback(err);
         } else {
             callback(null, result);
         }
     });
 }

/**
 * Route handler for POST /forgotPassword
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
function recoverPassword(req, callback) {
    // generate a reset password token
    var email = req.query.email;
    async.waterfall([
        function(cb) {
            crypto.randomBytes(config.DEFAULT_TOKEN_SIZE, cb);
        },
        function(buffer, cb) {
            var token = buffer.toString('hex');
            UserService.getByEmail(email, function(err, user) {
                cb(err, token, user);
            });
        },
        function(token, user, cb) {
            if (user) {
                var updatedUser = _.extend(user, {
                    resetPasswordToken: token,
                    resetPasswordExpired: false
                });
                updatedUser.save(cb);
            } else {
                cb(new NotFoundError('User not found'));
            }
        },
        function(user, numberAffected, cb) {
            NotificationService.notifyUserOfPassword(email, user.resetPasswordToken, cb);
        }
    ], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {});
        }
    });
}

/**
 * Route handler for POST /resetPassword
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
 function resetPassword(req, callback) {
     var resetPasswordToken = req.query.token,
         newPassword = req.query.newPassword;

     SecurityService.updatePassword(resetPasswordToken, newPassword, function(err) {
         if (err) {
             callback(err);
         } else {
             callback(null, {});
         }
     });
 }

/**
 * Route handler for GET /users/:id
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
 function getUserProfile(req, callback) {
     var id = req.params.id;
     UserService.get(id, function(err, user) {
         if (err) {
             callback(err);
         } else if (!user) {
             callback(new NotFoundError('User is not found with id: ' + id));
         } else {
             callback(null, user.toJSON());
         }
     });
 }

/**
 * Route handler for GET /users/me
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
 function getMyUserProfile(req, callback) {
     var id = req.user._id;
     UserService.get(id, function(err, user) {
         if (err) {
             callback(err);
         } else if (!user) {
             callback(new NotFoundError('User is not found with id: ' + id));
         } else {
             callback(null, user.toJSON());
         }
     });
 }

/**
 * Route handler for POST /revokeToken
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
function revokeAccessToken(req, callback) {
    // auth middleware perform the authentication
    SecurityService.revokeSessionToken(req.user._id, req.auth.token, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {});
        }
    });
}

/**
 * Route handler for PUT /users/me
 *
 * @param  {Object}     req         express request instance
 * @param  {Function}   callback    callback function
 */
 function updateCurrentUserProfile(req, callback) {
     var user = req.body;
     UserService.update(req.user._id, user, function(err, user) {
         if (err) {
             callback(err);
         } else {
             callback(null, user.toJSON());
         }
     });
 }


module.exports = {
    login                    : wrapExpress('UserController#login', login),
    registerUser             : wrapExpress('UserController#registerUser', registerUser),
    getAllowedActions        : wrapExpress('UserController#getAllowedActions', getAllowedActions),
    getActionRecords         : wrapExpress('UserController#getActionRecords', getActionRecords),
    recoverPassword          : wrapExpress('UserController#recoverPassword', recoverPassword),
    resetPassword            : wrapExpress('UserController#resetPassword', resetPassword),
    getUserProfile           : wrapExpress('UserController#getUserProfile', getUserProfile),
    getMyUserProfile         : wrapExpress('UserController#getMyUserProfile', getMyUserProfile),
    revokeAccessToken        : wrapExpress('UserController#revokeAccessToken', revokeAccessToken),
    updateCurrentUserProfile : wrapExpress('UserController#updateCurrentUserProfile', updateCurrentUserProfile)
};
