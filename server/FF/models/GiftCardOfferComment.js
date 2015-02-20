/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents Business Type.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GiftCardOfferCommentSchema = new Schema({
    userId: {type: String, required: true },
    comment: String,
    timestamp: {type: Date, default: Date.now },
    giftCardOfferId: String
});

// rename _id to id and remove useless fields when calling toJSON()
GiftCardOfferCommentSchema.options.toJSON = {
    transform: function(doc, ret) {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

// Export the Mongoose model
module.exports = GiftCardOfferCommentSchema;
