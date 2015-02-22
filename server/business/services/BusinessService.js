/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This service provides methods to manage business.
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

var Business = require("../models/index").Business;
var BusinessType = require("../models/index").BusinessType;

var GiftCardOfferService = require("../services/GiftCardOfferService");
var GiftCardService = require("../services/GiftCardService");


var BusinessService = {
    /**
     * Create business.
     * @param business {Business} the business
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    create: function(business, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(business, "business", error) ||
            !helper.validateRequiredParameter(business.name, "business.name", error) ||
            !helper.validateRequiredIntParameter(business.type, "business.type", error) ||
            !helper.validateRequiredParameter(business.address, "business.address", error) ||
            !helper.validateRequiredParameter(business.telephoneNumber, "business.telephoneNumber", error) ||
            !helper.validateRequiredParameter(business.picture, "business.picture", error) ||
            !helper.validateRequiredParameter(business.description, "business.description", error) ||
            !helper.validateRequiredParameter(business.businessHours, "business.businessHours", error) ||
            !helper.validateRequiredParameter(business.website, "business.website", error) ||
            !helper.validateRequiredParameter(business.businessHours, "business.businessHours", error) ||
            !helper.validateRequiredParameter(business.braintreeAccountId, "business.braintreeAccountId", error) ||
            !helper.validateRequiredParameter(business.notificationDate, "business.notificationDate", error) ||
            !helper.validateRequiredArrayFloatParameter(business.coordinates, "business.coordinates", error)) {
            callback(error.Err);
        } else {
            Business.create(business, callback);
        }
    },


    /**
     * Get business.
     * @param id {String} the business id
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    get: function(id, callback) {
        Business.findOne({
            _id: id
        }).exec(callback);
    //    }).populate("type").exec(callback);
    },


    /**
     * Get business by ids.
     * @param ids {[String]} the business ids
     * @param callback {Function<error:Error, result:Businesses>} the callback function
     */
    getByIds: function(ids, callback) {
        Business.find({
            _id: {
                "$in": ids
            }
        }).populate("type").exec(callback);
    },


    /**
     * Update business.
     * @param business {Business} the business
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    update: function(business, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(business, "business", error) ||
            !helper.validateRequiredParameter(business.id, "business.id", error)) {
            callback(error.Err);
        } else {
            Business.findOne({
                _id: business.id
            }, function(err, existing) {
                if (err) {
                    callback(err);
                } else if (existing !== null) {
                    _.extend(existing, business);
                    existing.save(callback);
                } else {
                    callback(new Error('Business not found with id: ' + business.id));
                }
            });
        }
    },

    /**
     * Delete business.
     * @param id {String} the business id
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    delete: function(id, callback) {
        // It cann't be deleted if there're active gift cards (of give card offers) existing in system
        async.waterfall([
            // Get buisness type ids by type name
            function(cb) {
                GiftCardOfferService.search({
                    "businessId": id
                }, cb);
            },
            function(giftCardOffer, cb) {
                if (giftCardOffer === null) {
                    cb(null);
                } else {
                    cb(new Error('Business with id: ' + id + ' is exist in giftCardOffer, can not be deleted'));
                }
            },
            function(cb) {
                GiftCardService.search({
                    "businessId": id
                }, cb);
            },
            function(giftCard, cb) {
                if (giftCard === null) {
                    cb(null);
                } else {
                    cb(new Error('Business with id: ' + id + ' is exist in giftCard, can not be deleted'));
                }
            },
            function() {
                Business.remove({
                    _id: id
                }, callback);
            }
        ], function(err) {
            callback(err);
        });
    },

    /**
     * Search businesses with criteria.
     * @param criteria {Object} the criteria
     * ==== The criteria parameters ===
     * pageSize              {Integer} The page size.
     * pageNumber            {Integer} The page number.
     * sortBy                {String}  The name of the property that will be used to sort the results, default to "id".
     * sortOrder             {String}  The sorting order. Must be one of "Ascending", "Descending", default to "Ascending".
     * businessName          {String}  This is used to partial match business name.
     * businessType          {String}  This is used to partial match business type.
     * businessAddress       {String}  This is used to partial match business address.
     * isVerified            {Boolean} This is used to partial match isVerified
     * isSubscriptionExpired {Boolean} This is used to partial match isSubscriptionExpired
     * ===============================
     * @param callback {Function<error:Error, result:SearchResult<Business>>} the callback function
     */
    search: function(criteria, callback) {
        var pageSize = criteria.pageSize || config.DEFAULT_PAGE_SIZE;
        var pageNumber = criteria.pageNumber || 1;
        var orderBy = criteria.sortBy || config.DEFAULT_SORT_BY;
        var order = criteria.sortOrder || config.DEFAULT_SORT_ORDER;

        var error = {};
        if (!helper.validatePageSize(pageSize, error) ||
            !helper.validatePageNumber(pageNumber, error) ||
            !helper.validateOrderBy(orderBy, error) ||
            !helper.validateOrder(order, error) ||
            !helper.validateBoolean(criteria['isVerified'], error) ||
            !helper.validateBoolean(criteria['isSubscriptionExpired'], error)) {
            callback(error.Err);
        } else {
            var filter = {};

            if (criteria['businessName']) {
                filter['businessName'] = {
                    "$regex": criteria.businessName
                };
            }

            if (criteria['businessAddress']) {
                filter['businessAddress'] = {
                    "$regex": criteria.businessAddress
                };
            }

            if (criteria['isVerified']) {
                filter['isVerified'] = criteria.isVerified;
            }

            if (criteria['isSubscriptionExpired']) {
                filter['isSubscriptionExpired'] = criteria.isSubscriptionExpired;
            }

            if (orderBy === "id") {
                orderBy = "_id";
            }
            var sortBy = {};
            sortBy[orderBy] = helper.getOrder(order);

            async.waterfall([
                // Get buisness type ids by type name
                function(cb) {
                    if (criteria['businessType']) {
                        BusinessType.find({
                            name: {
                                "$regex": criteria['businessType']
                            }
                        }, cb);
                    } else {
                        cb(null, undefined);
                    }

                },
                function(businessTypes, cb) {
                    if (businessTypes === undefined) {
                        cb(null);
                    } else {
                        var businessTypeIds = _.pluck(businessTypes, '_id');

                        filter['type'] = {};
                        filter['type']['$in'] = businessTypeIds;

                        cb(null);
                    }
                },
                function(cb) {
                    if (0 === parseInt(pageNumber)) {
                        Business.find(filter).sort(sortBy).populate("type").exec(function(err, items) {
                            if (err) {
                                callback(err);
                            } else {
                                var resultItems = _.map(items, function(item) {
                                    return item.toJSON();
                                });

                                var result = {
                                    totalPages: 1,
                                    pageNumber: 0,
                                    totalRecords: resultItems.length,
                                    items: resultItems
                                };
                                callback(null, result);
                            }
                        });
                    } else {
                        Business.paginate(filter, pageNumber, pageSize, function(err, pageCount, items, itemCount) {
                            if (err) {
                                callback(err);
                            } else {
                                var resultItems = _.map(items, function(item) {
                                    return item.toJSON();
                                });

                                var result = {
                                    totalPages: pageCount,
                                    pageNumber: parseInt(pageNumber),
                                    totalRecords: itemCount,
                                    items: resultItems
                                };
                                callback(null, result);
                            }
                        }, {
                            populate: 'type',
                            sortBy: sortBy
                        });

                    }

                }
            ], function(err) {
                callback(err);
            });
        }
    },

    /**
     * Verify the credit card.
     * @param creditCard {Object} the credit card
     * @param callback {Function<error:Error, result:Object>} the callback function
     */
    verify: function(creditCard, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(creditCard, "creditCard", error)) {
            callback(error.Err);
        } else {
            var gateway = braintree.connect(config.BRAINTREE_GATEWAY_CONFIG);

            async.waterfall([
                function(cb) {
                    gateway.customer.create(creditCard, cb);
                },
                function(result, cb) {
                    if (result.success) {
                        var subscriptionRequest = {
                            paymentMethodToken: result.customer.creditCards[0].token,
                            planId: config.BRAINTREE_SUBSCRIPTION_PLANID
                        };
                        gateway.subscription.create(subscriptionRequest, cb);
                    } else {
                        cb(new Error(result.message));
                    }
                },
                function(result) {
                    callback(null, result);
                }
            ], function(err) {
                callback(err);
            });
        }
    },

    /**
     * Get the coordinate by address.
     * @param address {String} the address
     * @param callback {Function<error:Error, result:Object>} the callback function
     * the result will be like:
     * [{
     *     "latitude": xxxx,
     *     "longitude": xxxx,
     *      ...
     * }]
     */
    getCoordinateByAddress: function(address, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(address, "address", error)) {
            callback(error.Err);
        } else {
            // Use geocoder to get coordinate
            // More detail see https://github.com/nchaulet/node-geocoder
            var geocoder = require('node-geocoder').getGeocoder(config.GEOCODER_PROVIDER, config.GEOCODER_HTTPADAPTER);

            geocoder.geocode(address, callback);
        }
    },

    /**
     * Get Business by braintreeAccountId.
     * @param id {String} the braintreeAccountId
     * @param callback {Function<error:Error, result:Business>} the callback function
     */
    getByAccountId: function(id, callback) {
        var error = {};
        if (!helper.validateRequiredParameter(id, "id", error)) {
            callback(error.Err);
        } else {
            Business.findOne({
                braintreeAccountId: id
            }).populate("type").exec(callback);
        }
    }

};

module.exports = BusinessService;
