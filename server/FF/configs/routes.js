/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This module contains the configuration for API routes.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

module.exports = {
    public:{
        'POST   /register'               : 'UserController#registerUser',
        'POST   /login'                  : 'UserController#login',
        'POST   /forgotPassword'         : 'UserController#recoverPassword',

        'GET    /giftCardOffers/:id'     : 'GiftCardOfferController#getGiftCardOffer',
        'GET    /users/me/giftCards/:id' : 'GiftCardController#getGiftCard',
        'GET    /giftCardOffers'         : 'GiftCardOfferController#searchGiftCardOffer',
    },
    authentic:{
        'GET    /users/me/giftCards'                      : 'GiftCardController#searchGiftCards',
        'POST   /users/me/giftCards/:id/resell'           : 'GiftCardController#resellGiftCard',
        'POST   /users/me/giftCards/:id/prepareForRedeem' : 'GiftCardController#prepareGiftCardForRedeem',
        'POST   /giftCards/redeem'                        : 'GiftCardController#redeemGiftCard',

        'GET    /users/me/actions'                        : 'UserController#getAllowedActions',
        'GET    /users/me/actionRecords'                  : 'UserController#getActionRecords',
        'POST   /resetPassword'                           : 'UserController#resetPassword',
        'GET    /users/me'                                : 'UserController#getMyUserProfile',
        'GET    /users/:id'                               : 'UserController#getUserProfile',
        'POST   /revokeToken'                             : 'UserController#revokeAccessToken',
        'PUT    /users/me'                                : 'UserController#updateCurrentUserProfile',

        'POST   /giftCards'                               : 'GiftCardOfferController#purchaseGiftCards',
        'POST   /giftCardOffers'                          : 'GiftCardOfferController#createGiftCardOffer',
        'DELETE /giftCardOffers/:id'                      : 'GiftCardOfferController#deleteGiftCardOffer',
        'PUT    /giftCardOffers/:id'                      : 'GiftCardOfferController#updateGiftCardOffer',
        'POST   /giftCardOffers/:id/cancel'               : 'GiftCardOfferController#cancelGiftCardOffer',
        'GET    /giftCardOffers/:id/owners'               : 'GiftCardOfferController#getGiftCardOfferOwner',
        'GET    /giftCardOffers/:id/comments'             : 'GiftCardOfferController#getComments',
        'POST   /giftCardOffers/:id/comments'             : 'GiftCardOfferController#addComment',
        'DELETE /giftCardOffers/:id/comments/:commentId'  : 'GiftCardOfferController#deleteComment'
    }

};

