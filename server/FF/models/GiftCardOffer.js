/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents Gift Card offer.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GiftCardOfferSchema = new Schema({
    businessId         : {type: String, required: true },
    businessName       : {type: String, required: true },
    businessType       : {type: String, required: true },
    businessAddress    : {type: String, required: true },
    businessPicture    : {type: String, required: true },
    businessTelephone  : {type: String, required: true },
    discount           : {type: Number, required: true },
    activationDateTime : {type: Date, required: true },
    endDateTime        : {type: Date, required: false },
    description        : {type: String, required: true },
    availableQuantity  : {type: Number, required: true },
    status             : {type: String, required: true, uppercase: true, enum: ['ACTIVE', 'ENDED', 'CANCELLED', 'DRAFT'] },
    totalQuantity      : {type: Number, required: false },
    createdOn          : Date,
    createdBy          : String,
    modifiedOn         : Date,
    modifiedBy         : String,
    price              : Number,
    resaleForGiftCard  : String,
    expirationDate     : Date,
    condition          : String,
    redeemedQuantity   : Number
});

// rename _id to id and remove useless fields when calling toJSON()
GiftCardOfferSchema.options.toJSON = {
    transform: function(doc, ret) {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.createdOn;
        delete ret.createdBy;
        delete ret.modifedOn;
        delete ret.modifiedBy;
        delete ret.price;
        delete ret.resaleForGiftCard;
        delete ret.expirationDate;
        delete ret.condition;
        delete ret.redeemedQuantity;

        return ret;
    }
};

GiftCardOfferSchema.plugin(require('mongoose-paginate'));

// Export the Mongoose model
module.exports = GiftCardOfferSchema;
