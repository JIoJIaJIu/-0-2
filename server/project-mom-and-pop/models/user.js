/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * User model.
 */
var mongoose = require('mongoose');

///////////////////////
// MODEL DEFINITION  //
///////////////////////
var userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true }
});

/**
 * Export the Mongoose Model.
 */
module.exports = mongoose.model('User', userSchema);
