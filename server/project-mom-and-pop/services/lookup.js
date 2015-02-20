/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Lookup Service
 */
var db = require('./../helpers/db-helper');
var mongoose = db.getMongoose();
var OfferCategory = mongoose.model('OfferCategory', require('./../models/offerCategory').OfferCategorySchema);
var ActionType = mongoose.model('ActionType', require('./../models/actionType').ActionTypeSchema);
var FeedbackType = mongoose.model('FeedbackType', require('./../models/feedbackType').FeedbackTypeSchema);
var BusinessType = mongoose.model('BusinessType', require('./../models/businessType').BusinessTypeSchema);

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Service to get all offer categories from database.
 * @param {Function} callback The callback function <error: Error, result: OfferCategory[]> 
 */
exports.getAllOfferCategories = function(callback) {
  OfferCategory.find({}, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

/**
 * Service to get all action types from database.
 * @param {Function} callback The callback function <error: Error, result: ActionType[]>
 */
exports.getAllActionTypes = function(callback) {
  ActionType.find({}, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

/**
 * Service to get all feedback types from database.
 * @param {Function} callback The callback function <error: Error, result: FeedbackType[]>
 */
exports.getAllFeedbackTypes = function(callback) {
  FeedbackType.find({}, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

/**
 * Service to get all business types from database.
 * @param {Function} callback The callback function <error: Error, result: BusinessType[]>
 */
exports.getAllBusinessTypes = function(callback) {
  BusinessType.find({}, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};
