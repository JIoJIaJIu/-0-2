/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Initial DB for testing.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

var COLLECTION_NAMES = ['Business', 'GiftCard', 'GiftCardOffer', 'GiftCardOfferComment', 'GiftCardRedeem', 'User', 'SessionToken'];

var _ = require('underscore'),
    dbModels = require('../models');

/**
 * Clear the collection
 *
 * @param  {String} collectionName The collection to clear
 */
function _clearCollection(collectionName) {
    dbModels[collectionName].remove({}).exec();
    console.log('DB Collection [' + collectionName + '] is clear.');
}

/**
 * Initial the collection
 *
 * @param  {String} collectionName The collection to initial
 */
function _initialCollection(collectionName) {
    var Schema = dbModels[collectionName];

    var data = require('./' + collectionName + '.json');
    _.each(data, function(value) {
        new Schema(value).save();
    });
    console.log('DB Collection [' + collectionName + '] is initialised.');
}


/**
 * Inital the Database
 *
 * @param  {Boolean} clearFlag The flag whether initial collections
 */
function initialDB(clearFlag) {
    if (clearFlag) {
        _.each(COLLECTION_NAMES, function(name) {
            _clearCollection(name, clearFlag);
        });

        _.each(COLLECTION_NAMES, function(name) {
            _initialCollection(name, clearFlag);
        });
    }
}


module.exports = initialDB;
