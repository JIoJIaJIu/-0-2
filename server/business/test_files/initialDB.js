/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Initial DB for testing.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var COLLECTION_NAMES = ["ActionType", "ActionRecord", "BusinessType", "Business"];

var _ = require('underscore'),
    dbModels = require('../models');


function initialDB(clearFlag) {
    _.each(COLLECTION_NAMES, function(name) {
        initialCollection(name, clearFlag);
    });
}

function initialCollection(collectionName, clearFlag) {
    var schema = dbModels[collectionName];
    if (clearFlag) {
        // remove all exist data
        schema.remove({}).exec();
        console.log('DB Collection [' + collectionName + '] is clear.');
    }

    schema.count({}, function(err, count) {
        // if data exist, no need insert
        if (count > 0) {
            console.log('DB Collection [' + collectionName + '] exists, no need insert.');
            return;
        }

        var data = require('./' + collectionName + '.json');
        _.each(data, function(value) {
            new schema(value).save();
        });
        console.log('DB Collection [' + collectionName + '] is initialised.');
    });

}

module.exports = initialDB;
