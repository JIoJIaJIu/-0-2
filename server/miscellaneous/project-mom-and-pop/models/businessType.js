/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * BusinessType model.
 */
var mongoose = require('mongoose');

///////////////////////
// SCHEMA DEFINITION //
///////////////////////
var businessTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

/**
 * Export the Mongoose Model.
 */
module.exports = mongoose.model('BusinessType', businessTypeSchema);
