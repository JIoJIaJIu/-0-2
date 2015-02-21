/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Init and export all schemas.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";


var mongoose = require('mongoose'),
    config = require("../config");

var db = mongoose.createConnection(config.MONGODB_URL, {
    server: {
        poolSize: config.MONGODB_CONNECTION_POOL_SIZE
    }
});

module.exports = {
    BusinessType: db.model('BusinessType', require('./BusinessType')),
    Business: db.model('Business', require('./Business')),
    ActionType: db.model('ActionType', require('./ActionType')),
    ActionRecord: db.model('ActionRecord', require('./ActionRecord'))
};
