/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * The model for Session Token.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionTokenSchema = new Schema({
    userId: String,
    token: String,
    expirationDate: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = SessionTokenSchema;
