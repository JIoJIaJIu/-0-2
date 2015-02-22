/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * GiftCardOfferController
 * This controller exposes REST actions for giftCardOffer
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

/* Globals */

var winston = require('winston'),
    _ = require('underscore'),
    async = require('async'),
    helper = require('../helpers/helper'),
    wrapExpress = require('../helpers/logging').wrapExpress;

var GiftCardOfferService = require('../services/GiftCardOfferService');

var ValidationError = require('../errors/ValidationError'),
    NotFoundError = require('../errors/NotFoundError');

var operationTypes = {
    POST: 'POST',
    PUT: 'PUT'
};

var config = require('../configs/config');
var url = require('url');

/**
 * Validate the given entity.
 * Validation is performed before save or update operation
 *
 * @param  {Entity}     entity      Validate the given entity based on PUT or POST operation
 * @param  {Function}   callback    callback function<error, result>
 */
var _validateEntity = function(operationType, entity, callback) {
    var error;
    // if it is a post operation. All fields are mandatory
    if (operationType === operationTypes.POST) {
        error = helper.checkString(entity.businessId, 'businessId') || helper.checkString(entity.businessName, 'businessName') ||
            helper.checkString(entity.businessType, 'businessType') || helper.checkString(entity.businessAddress, 'businessAddress') ||
            helper.checkString(entity.businessPicture, 'businessPicture') || helper.checkPositiveNumber(entity.discount, 'discount') ||
            helper.checkDate(entity.activationDateTime, 'activationDateTime') || helper.checkDate(entity.endDateTime, 'endDateTime') ||
            helper.checkString(entity.description, 'description') || helper.checkString(entity.status, 'status') ||
            helper.checkPositiveNumber(entity.totalQuantity, 'totalQuantity') || helper.checkPositiveNumber(entity.availableQuantity, 'availableQuantity');
    }
    callback(error, entity);
};

var addProperties = function(req, operationType, entity) {
    if (operationType === operationTypes.POST) {
        entity.createdOn = new Date();
        entity.modifiedOn = new Date();
        // req.user is set by the auth middleware
        if (req.user) {
            entity.createdBy = req.user.id;
            entity.modifiedBy = req.user.id;
        }
    } else if (operationType === operationTypes.PUT) {
        entity.modifiedOn = new Date();
        // req.user is set by the auth middleware
        if (req.user) {
            entity.modifiedBy = req.user.id;
        }
    }
};

var _validateCommentEntity = function(entity, callback) {
    var error = helper.checkString(entity.userId, 'userId') || helper.checkString(entity.comment, 'comment') ||
        helper.checkString(entity.giftCardOfferId, 'giftCardOfferId');
    callback(error, entity);
};

/**
 * Route handler for POST /giftCardOffers
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function createGiftCardOffer(req, callback) {
    // validate the fields
    var entity = req.body;
    if (!entity) {
        return callback(new ValidationError('Request body cannot be empty'));
    }
    async.waterfall([
        // validate entity
        function(cb) {
            _validateEntity(operationTypes.POST, entity, cb);
        },
        function(validatedEntity, cb) {
            addProperties(req, operationTypes.POST, entity);
            // create entity
            GiftCardOfferService.create(validatedEntity, cb);
        }
    ], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.toJSON(), helper.HTTP_CREATED);
        }
    });
}

/**
 * Route handler for GET /giftCardOffers
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function searchGiftCardOffer(req, callback) {
    var query = req.query;
    winston.info('Query params ' + JSON.stringify(query));
    GiftCardOfferService.search(query, function(err, result) {
        if (err) {
            return callback(err);
        }
        /*
        result.items.forEach(function (json) {
            // resolve static url
            json.businessPicture = url.resolve(config.STATIC_URL, json.businessPicture);
        })
        */
        callback(null, result);
    });
}

/**
 * Route handler for GET /giftCardOffers/:id
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function getGiftCardOffer(req, callback) {
    var id = req.params.id;
    GiftCardOfferService.get(id, function(err, result) {
        if (err) {
            callback(err);
        } else if (!result) {
            callback(new NotFoundError('Gift card offer is not found with id: ' + id));
        } else {
            callback(null, result.toJSON());
        }
    });
}

/**
 * Route handler for DELETE /giftCardOffers/:id
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function deleteGiftCardOffer(req, callback) {
    var id = req.params.id;
    GiftCardOfferService.delete(id, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {}, helper.HTTP_DELETED);
        }
    });
}

/**
 * Route handler for PUT /giftCardOffers/:id
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function updateGiftCardOffer(req, callback) {
    var id = req.params.id;
    var entity = req.body;
    async.waterfall([
        function(cb) {
            // check if entity exists
            GiftCardOfferService.get(id, cb);
        },
        function(giftCardOffer, cb) {
            if (giftCardOffer) {
                // validate the entity
                _validateEntity(operationTypes.PUT, entity, cb);
            } else {
                cb(new NotFoundError('Gift card offer not found with id ' + id));
            }
        },
        function(validatedEntity, cb) {
            addProperties(req, operationTypes.POST, entity);
            // there may be a scenario when user intentionally pass id field in request.body
            _.omit(validatedEntity, 'id', '_id');
            // update entity
            GiftCardOfferService.update(id, validatedEntity, cb);
        }
    ], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.toJSON());
        }
    });
}

/**
 * Route handler for POST /giftCardOffers/{id}/cancel
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function cancelGiftCardOffer(req, callback) {
    var id = req.params.id;
    GiftCardOfferService.cancel(id, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {});
        }
    });
}

/**
 * Route handler for GET /giftCardOffers/{id}/owners
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function getGiftCardOfferOwner(req, res, callback) {
    var id = req.params.id;
    GiftCardOfferService.getOwners(id, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Route handler for POST /giftCardOffers/:id/comments
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function addComment(req, res, callback) {
    var entity = req.body,
        offerId = req.params.id;

    // client may intentionally pass request param offer id to be different than entity offerId
    if (entity.giftCardOfferId !== offerId) {
        return callback(new ValidationError('request body offer ID should be same as path param offer ID'));
    }
    async.waterfall([
        function(cb) {
            _validateCommentEntity(entity, cb);
        },
        function(validatedEntity, cb) {
            // check if offer exists
            GiftCardOfferService.get(offerId, function(err, giftCardOffer) {
                if (giftCardOffer) {
                    // add gift card comment
                    GiftCardOfferService.addComment(validatedEntity, cb);
                } else {
                    cb(new NotFoundError('Gift Card Offer not found for offerId' + offerId));
                }
            });
        },
    ], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result, helper.HTTP_CREATED);
        }
    });
}

/**
 * Route handler for DELETE /giftCardOffers/:id/comments/:commentId
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function deleteComment(req, callback) {
    var offerId = req.params.id,
        commentId = req.params.commentId;

    async.waterfall([
        function(cb) {
            GiftCardOfferService.get(offerId, function(err, giftCardOffer) {
                if (giftCardOffer) {
                    GiftCardOfferService.removeComment(offerId, commentId, cb);
                } else {
                    cb(new NotFoundError('Gift Card Offer not found for offerId' + offerId));
                }
            });
        }
    ], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {}, helper.HTTP_DELETED);
        }
    });
}

/**
 * Route handler for GET /giftCardOffers/:id/comments
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
function getComments(req, res, callback) {
    var offerId = req.params.id;
    GiftCardOfferService.getComments(offerId, function(err, comments) {
        if (err) {
            callback(err);
        } else {
            callback(null, comments);
        }
    });
}

/**
 * Purchase gift cards
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function purchaseGiftCards(req, callback) {
    var shoppingCart = req.body;
    var error = helper.checkDefined(shoppingCart.items, 'items') || helper.checkDefined(shoppingCart.creditCard, 'creditCard');

    if (error) {
        return callback(error);
    }
    GiftCardOfferService.purchase(shoppingCart, req.user, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result, helper.HTTP_CREATED);
        }
    });
}

module.exports = {
    createGiftCardOffer   : wrapExpress('GiftCardOfferController#createGiftCardOffer', createGiftCardOffer),
    searchGiftCardOffer   : wrapExpress('GiftCardOfferController#searchGiftCardOffer', searchGiftCardOffer),
    getGiftCardOffer      : wrapExpress('GiftCardOfferController#getGiftCardOffer', getGiftCardOffer),
    deleteGiftCardOffer   : wrapExpress('GiftCardOfferController#deleteGiftCardOffer', deleteGiftCardOffer),
    updateGiftCardOffer   : wrapExpress('GiftCardOfferController#updateGiftCardOffer', updateGiftCardOffer),
    cancelGiftCardOffer   : wrapExpress('GiftCardOfferController#cancelGiftCardOffer', cancelGiftCardOffer),
    getGiftCardOfferOwner : wrapExpress('GiftCardOfferController#getGiftCardOfferOwner', getGiftCardOfferOwner),
    addComment            : wrapExpress('GiftCardOfferController#addComment', addComment),
    deleteComment         : wrapExpress('GiftCardOfferController#deleteComment', deleteComment),
    getComments           : wrapExpress('GiftCardOfferController#getComments', getComments),
    purchaseGiftCards     : wrapExpress('GiftCardOfferController#purchaseGiftCards', purchaseGiftCards)
};
