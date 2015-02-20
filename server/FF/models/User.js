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

var UserRoleSchema = new Schema({
    businessId: String,
    role: {
        type: String,
        uppercase: true,
        enum: ['INDIVIDUAL_USER', 'BUSINESS_EMPLOYEE', 'BUSINESS_ADMIN', 'CLIENT', 'PLATFORM_EMPLOYEE']
    }
});

var UserSchema = new Schema({
    firstName                 : { type: String, required: true },
    lastName                  : { type: String, required: true },
    email                     : { type: String, required: true },
    location                  : String,
    picture                   : String,
    isFirstNamePublic         : { type: Boolean, required: false, Default: true },
    isLastNamePublic          : { type: Boolean, required: false, Default: true },
    isEmailPublic             : { type: Boolean, required: false, Default: true },
    isLocationPublic          : { type: Boolean, required: false, Default: true },
    isPicturePublic           : { type: Boolean, required: false, Default: true },
    passwordHash              : { type: String, required: false },
    userRoles                 : [UserRoleSchema],
    interestedOfferCategory   : String,
    linkedSocialNetwork       : {type: String, required: false, uppercase: true, enum: ['FACEBOOK', 'TWITTER', 'LINKEDIN']},
    linkedSocialNetworkUserId : String,
    resetPasswordToken        : String,
    resetPasswordExpired      : Boolean
});

// remove useless fields when calling toJSON()
UserRoleSchema.options.toJSON = {
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;

        return ret;
    }
};

// rename _id to id and remove useless fields when calling toJSON()
UserSchema.options.toJSON = {
    transform: function(doc, ret) {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;

        delete ret.passwordHash;
        delete ret.interestedOfferCategory;
        delete ret.linkedSocialNetwork;
        delete ret.linkedSocialNetworkUserId;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpired;

        if (!doc.isFirstNamePublic) {
            delete ret.firstName;
        }
        if (!doc.isLastNamePublic) {
            delete ret.lastName;
        }
        if (!doc.isEmailPublic) {
            delete ret.email;
        }
        if (!doc.isLocationPublic) {
            delete ret.location;
        }
        if (!doc.isPicturePublic) {
            delete ret.picture;
        }

        return ret;
    }
};

// Export the Mongoose model
module.exports = UserSchema;
