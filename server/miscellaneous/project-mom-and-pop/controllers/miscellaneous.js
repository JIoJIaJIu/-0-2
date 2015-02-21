/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Miscellaneous Controller
 */
var notifService = require('./../services/notification');
var resp = require('./../helpers/response-helper');
var validate = require('./../helpers/validation-helper');

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Middleware controller to send feedback to an admin using emailing function.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} next Next middleware to execute.
 */
exports.sendFeedback = function(req, res, callback) {
  var feedback = req.body;
  var isValid = validate.feedback(feedback);
  if (!isValid) {
    callback(resp.makeResponseError(400, 'Some required parameters were missing'));
  } else {
    notifService.notifyAdminOfFeedback(feedback, function(err) {
      if (err) {
        callback(err);
      } else {
        res.status(201).json(feedback);
      }
    });
  }
};

/**
 * Middleware controller to send abuse report to an admin using emailing function.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} next Next middleware to execute.
 */
exports.reportAbuse = function(req, res, callback) {
  var reportedAbuse = req.body;
  var isValid = validate.reportedAbuse(reportedAbuse);
  if (!isValid) {
    callback(resp.makeResponseError(400, 'Some required parameters were missing'));
  } else {
    notifService.notifyAdminOfReportedAbuse(reportedAbuse, function(err) {
      if (err) {
        callback(err);
      } else {
        res.status(201).json(reportedAbuse);
      }
    });
  }
};

/**
 * Middleware controller to send an invite to a friend of a user using emailing function.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {Function} next Next middleware to execute.
 */
exports.inviteFriend = function(req, res, callback) {
  var friendInvitation = req.body;
  var isValid = validate.friendInvitation(friendInvitation);
  if (!isValid) {
    callback(resp.makeResponseError(400, 'Some required parameters were missing'));
  } else {
    notifService.notifyUserOfInvitation(friendInvitation, function(err) {
      if (err) {
        callback(err);
      } else {
        res.status(201).json(friendInvitation);
      }
    });
  }
};
