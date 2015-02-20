/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents Business.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define schema
var BusinessSchema = new Schema({
    name                    : {type: String, required: true },
    type                    : {type: String, required: true },
    address                 : {type: String, required: true },
    telephoneNumber         : {type: String, required: true },
    picture                 : {type: String, required: true },
    description             : {type: String, required: true },
    businessHours           : {type: String, required: true },
    website                 : {type: String, required: false },
    isNamePublic            : {type: Boolean, required: false, default: true },
    isTypePublic            : {type: Boolean, required: false, default: true },
    isAddressPublic         : {type: Boolean, required: false, default: true },
    isTelephoneNumberPublic : {type: Boolean, required: true },
    isPicturePublic         : {type: Boolean, required: false, default: true },
    isDescriptionPublic     : {type: Boolean, required: false, default: true },
    isBusinessHoursPublic   : {type: Boolean, required: false, default: true },
    isWebsitePublic         : {type: Boolean, required: false, default: true },
    isVerified              : {type: Boolean, required: false, default: false },
    isSubscriptionExpired   : {type: Boolean, required: true },
    braintreeAccountId      : {type: String, required: true },
    coordinates             : [Number],
    notificationDate        : {type: Date, required: true }
});

// rename _id to id and remove useless fields when calling toJSON()
BusinessSchema.options.toJSON = {
    transform: function(doc, ret) {
        ret.id = doc._id.toString();

        delete ret._id;
        delete ret.__v;
        delete ret.isVerified;
        delete ret.isSubscriptionExpired;
        delete ret.braintreeAccountId;
        delete ret.coordinates;
        delete ret.notificationDate;

        if (!doc.isNamePublic) {
            delete ret.name;
        }
        if (!doc.isTypePublic) {
            delete ret.type;
        }
        if (!doc.isAddressPublic) {
            delete ret.address;
        }
        if (!doc.isTelephoneNumberPublic) {
            delete ret.telephoneNumber;
        }
        if (!doc.isPicturePublic) {
            delete ret.picture;
        }
        if (!doc.isDescriptionPublic) {
            delete ret.description;
        }
        if (!doc.isBusinessHoursPublic) {
            delete ret.businessHours;
        }
        if (!doc.isWebsitePublic) {
            delete ret.website;
        }
        return ret;
    }
};

BusinessSchema.plugin(require('mongoose-paginate'));

// Export the Mongoose model
module.exports = BusinessSchema;
