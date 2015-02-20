/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Response Helper.
 * This file defines the standard response for the app.
 */

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Send a succesful response.
 * If req.statusCode is undefined, status code will default to 200.
 * If req.data is defined, it will be sent as the response body.
 *   If req.data is undefined, a standard status code definition is sent as the response instead.
 * @param {Request} req The request.
 * @param {Response} res The response.
 */
exports.sendSuccess = function(req, res) {
  req.statusCode = req.statusCode || 200;
  if (req.data) {
    res.status(req.statusCode).json(req.data);
  } else {
    res.sendStatus(req.statusCode);
  }
};

/**
 * Send a not successful response.
 * If req.statusCode is undefined, status code will default to 500.
 * If req.data is defined, it will be sent as the response body.
 *   If req.data is undefined, a standard status code definition is sent as the response instead.
 * @param {Error} err The error.
 * @param {Request} req The request.
 * @param {Response} res The response.
 * @param {Function} callback The callback function.
 */
exports.sendError = function(err, req, res, callback) {
  err.statusCode = err.statusCode || 500;
  if (err.message) {
    res.status(err.statusCode).json(err.message);
  } else {
    res.sendStatus(err.statusCode);
  }
};

/**
 * Make an Error object to be sent as a response containing its status code and the message.
 * @param {Number} statusCode The status code.
 * @param {String} message The error message.
 */
exports.makeResponseError = function(statusCode, message) {
  var err = new Error();
  err.statusCode = statusCode;
  return err;
};
