/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents controller for Business.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var config = require('../config'),
    helper = require('../helpers/helper'),
    _ = require('underscore'),
    async = require('async'),
    braintree = require("braintree");

var BusinessService = require("../services/BusinessService"),
    UserService = require("../services/UserService");


var BusinessController = {
    getBusinessProfile: function(req, res) {
        BusinessService.get(req.params.id, function(err, business) {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else if (!business) {
                res.status(404).json('Business is not found with id: ' + req.params.id);
            } else {
                res.status(200).json(business);
            }
        });
    },


    getMyBusinessProfile: function(req, res) {
        var businessIds = _.pluck(req.user.userRoles, 'businessId');
        BusinessService.getByIds(businessIds, function(err, businesses) {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                res.status(200).json(businesses);
            }
        });
    },


    getBusinessReport: function(req, res) {
        res.status(500).send("Not Implemented");
    },


    getBusinessEmployees: function(req, res) {
        UserService.search({
            userRole: ["BUSINESS_EMPLOYEE"]
        }, function(err, users) {
            if (err) {
                res.status(500).json({
                    error: 'Failed to perform the operation.'
                });
            } else {
                res.status(200).json(users);
            }
        });
    },


    addBusinessEmployee: function(req, res) {
        req.body.userRole = ["BUSINESS_EMPLOYEE"];
        UserService.create(req.body, function(err, user) {
            if (err) {
                res.status(500).json({
                    error: 'Failed to perform the operation.'
                });
            } else {
                res.status(200).json(user);
            }
        });
    },


    deleteBusinessEmployee: function(req, res) {
        UserService.delete(req.params.id, function(err, user) {
            if (err) {
                res.status(500).json({
                    error: 'Failed to perform the operation.'
                });
            } else {
                res.status(204).end();
            }
        });
    },


    updateBusinessEmployee: function(req, res) {
        req.body.id = req.params.id;
        UserService.update(req.body, function(err, user) {
            if (err) {
                res.status(500).json({
                    error: 'Failed to perform the operation.'
                });
            } else {
                res.status(200).json(user);
            }
        });
    },


    updateMyBuninessProfile: function(req, res) {
        BusinessService.update(req.body, function(err, business) {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                res.status(200).json(business);
            }
        });
    },


    verifyMyBuninessProfile: function(req, res) {
        BusinessService.verify(req.body, function(err, result) {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                res.status(200).json(result);
            }
        });
    },


    notifyExpiration: function(req, res) {
        var btSignature = req.body.btSignature;
        var btPayload = req.body.btPayload;

        var error = {};
        if (!helper.validateRequiredParameter(btSignature, "btSignature", error) ||
            !helper.validateRequiredParameter(btPayload, "btPayload", error)) {
            res.status(500).json({
                error: error.Err.message
            });
            return;
        } else {
            var gateway = braintree.connect(config.BRAINTREE_GATEWAY_CONFIG);

            async.waterfall([
                function(cb) {
                    //reference: https://www.braintreepayments.com/docs/node/subscriptions/details
                    //https://www.braintreepayments.com/docs/ruby/guide/webhook_notifications
                    console.log("1111111111");
                    gateway.webhookNotification.parse(btSignature, btPayload, cb);
                },
                function(webhookNotification, cb) {
                    console.log("2222");
                    // if webhookNotification.kind is one of the following:
                    // 1) Subscription Canceled
                    // 2) Subscription Charged Unsuccessfully
                    // 3) Subscription Expired
                    BusinessService.getByAccountId(webhookNotification.subscription.merchantAccountId, cb);
                },
                function(existing, cb) {
                    console.log("3333");
                    var business = _.extend(existing, {
                        isSubscriptionExpired: true
                    });
                    BusinessService.update(business, cb);
                },
                function(updated) {
                    res.status(200).json(updated);
                }
            ], function(err) {
                res.status(500).json({
                    error: err.message
                });
            });
        }

    }


};



module.exports = BusinessController;
