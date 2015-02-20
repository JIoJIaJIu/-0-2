/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Secured middleware.
 * This middleware is used to determine whether the user is authorized to do the action or not.
 */

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Determine whether the user is authorized to do the action or not.
 * NOTE: It's a stub function since this function is outside the scope of the challenge.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {Function} callback The callback function.
 */
module.exports = function secured(action) {
  return function(req, res, callback) {
    callback();
  }
};
