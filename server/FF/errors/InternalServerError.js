/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Internal Server error
 *
 * @author      spanhawk
 * @version     0.0.1
 */
"use strict";


var HTTP_INTERNAL_SERVER_ERROR = 500;
var NAME = 'InternalServerError';

/**
 * Constructor
 *
 * @param {String}      message       The error message
 */
function InternalServerError(message) {
  // capture stack trace
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = NAME;
  this.message = message;
  this.code = HTTP_INTERNAL_SERVER_ERROR;
}

require('util').inherits(InternalServerError, Error);
InternalServerError.prototype.name = 'InternalServerError';

/**
 * Module exports
 */
module.exports = InternalServerError;
