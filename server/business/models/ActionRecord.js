/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents Action Record.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define  schema
var ActionRecordSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    type: {
        type: Number,
        required: true,
        ref: 'ActionType'
    },
    details: {
        type: String,
        required: true
    }
});

// rename _id to id, and remove useless fields when calling toJSON()
ActionRecordSchema.options.toJSON = {
    transform: function(doc, ret) {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

ActionRecordSchema.plugin(require('mongoose-paginate'));

// Export the Mongoose model
module.exports = ActionRecordSchema;
