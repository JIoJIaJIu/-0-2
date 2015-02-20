/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Lookup Controller
 */
var lookupService = require('./../services/lookup');
var resp = require('./../helpers/response-helper');

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Middleware controller to get all offer categories
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllOfferCategories = function(req, res, callback) {
  lookupService.getAllOfferCategories(function(err, result) {
    if(err) {
      callback(resp.makeResponseError(500, 'Failed to perform the operation'));
    } else {
      res.status(200).json(result);
    }
  });
};

/**
 * Middleware controller to get all action types.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllActionTypes = function(req, res, callback) {
  lookupService.getAllActionTypes(function(err, result) {
    if(err) {
      callback(resp.makeResponseError(500, 'Failed to perform the operation'));
    } else {
      res.status(200).json(result);
    }
  });
};

/**
 * Middleware controller to get all feedback types.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllFeedbackTypes = function(req, res, callback) {
  lookupService.getAllFeedbackTypes(function(err, result) {
    if(err) {
      callback(resp.makeResponseError(500, 'Failed to perform the operation'));
    } else {
      res.status(200).json(result);
    }
  });
};

/**
 * Middleware controller to get all business types.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} callback Next middleware to execute.
 */
exports.getAllBusinessTypes = function(req, res, callback) {
  lookupService.getAllBusinessTypes(function(err, result) {
    if(err) {
      callback(resp.makeResponseError(500, 'Failed to perform the operation'));
    } else {
      res.status(200).json(result);
    }
  });
};
