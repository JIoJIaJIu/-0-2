/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Init and export all schemas.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';


var mongoose = require('mongoose'),
    config = require('../configs/config');

var db = mongoose.createConnection(config.MONGODB_URL, {
    server: {
        poolSize: config.MONGODB_CONNECTION_POOL_SIZE
    }
});

module.exports = {
    Business: db.model('Business', require('./Business')),
    GiftCard: db.model('GiftCard', require('./GiftCard')),
    GiftCardOffer: db.model('GiftCardOffer', require('./GiftCardOffer')),
    GiftCardOfferComment: db.model('GiftCardOfferComment', require('./GiftCardOfferComment')),
    GiftCardRedeem: db.model('GiftCardRedeem', require('./GiftCardRedeem')),
    SessionToken: db.model('SessionToken', require('./SessionToken')),
    User: db.model('User', require('./User'))
};
