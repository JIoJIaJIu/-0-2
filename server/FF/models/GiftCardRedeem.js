/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents Gift Card Redeem.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define  schema
var GiftCardRedeemSchema = new Schema({
    giftCardId          : {type: String, required: true },
    amount              : {type: Number, required: true },
    redeemQRCode        : {type: String, required: true },
    redeemQRCodePicture : {type: String, required: true },
    timestamp           : {type: Date, required: true },
    redeemedAmount      : {type: Number, required: true }
});

// remove useless fields when calling toJSON()
GiftCardRedeemSchema.options.toJSON = {
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

// Export the Mongoose model
module.exports = GiftCardRedeemSchema;
