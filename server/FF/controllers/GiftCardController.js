/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents controller for Gift Card.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

var GiftCardService = require('../services/GiftCardService'),
    wrapExpress = require('../helpers/logging').wrapExpress,
    NotFoundError = require('../errors/NotFoundError');

/**
 * Search gift cards
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function searchGiftCards(req, callback) {
    GiftCardService.search(req.query, function(err, giftCards) {
        if (err) {
            callback(err);
        } else {
            callback(null, giftCards);
        }
    });
}

/**
 * Get the gift card by id
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function getGiftCard(req, callback) {
    GiftCardService.get(req.params.id, function(err, giftCard) {
        if (err) {
            callback(err);
        } else if (!giftCard) {
            callback(new NotFoundError('GiftCard is not found with id: ' + req.params.id));
        } else {
            callback(null, giftCard.toJSON());
        }
    });
}

/**
 * Resell gift cards
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function resellGiftCard(req, callback) {
    GiftCardService.resell(req.params.id, req.query.quantityToSell, req.query.description, function(err, giftCardOffer, giftCard) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                'giftCard': giftCard.toJSON(),
                'giftCardOffer': giftCardOffer
            });
        }
    });
}

/**
 * Prepare gift card for redeem
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function prepareGiftCardForRedeem(req, callback) {
    GiftCardService.prepareForRedeem(req.params.id, req.query.amount, function(err, redeem) {
        if (err) {
            callback(err);
        } else if (!redeem) {
            callback(new NotFoundError('GiftCard is not found with id: ' + req.params.id));
        } else {
            callback(null, redeem.toJSON());
        }
    });
}

/**
 * Redeem gift card
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function redeemGiftCard(req, callback) {
    GiftCardService.redeem(req.query.qrCode, req.query.amount, function(err, giftCard) {
        if (err) {
            callback(err);
        } else {
            callback(null, giftCard.toJSON());
        }
    });
}

/**
 * Update gift card
 * @param {Object} req the request object
 * @param {Function} callback the callback function
 */
function update(req, callback) {
    GiftCardService.update(req.body, function(err, giftCard) {
        if (err) {
            callback(err);
        } else {
            callback(null, giftCard.toJSON());
        }
    });
}



module.exports = {
    searchGiftCards          : wrapExpress('GiftCardController#searchGiftCards', searchGiftCards),
    getGiftCard              : wrapExpress('GiftCardController#getGiftCard', getGiftCard),
    resellGiftCard           : wrapExpress('GiftCardController#resellGiftCard', resellGiftCard),
    prepareGiftCardForRedeem : wrapExpress('GiftCardController#prepareGiftCardForRedeem', prepareGiftCardForRedeem),
    redeemGiftCard           : wrapExpress('GiftCardController#redeemGiftCard', redeemGiftCard),
    update                   : wrapExpress('GiftCardController#update', update)
};
