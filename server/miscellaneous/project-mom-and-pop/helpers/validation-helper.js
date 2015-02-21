/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Validation Helper.
 * This file is a wrapper for validating input model.
 */

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Validate Feedback resource object.
 * It must have a subject, type, message, and userId properties.
 * @param {Feedback} feedback The feedback object.
 * @return {Boolean} True if it's a valid feedback object. Otherwise, it's false.
 */
exports.feedback = function(feedback) {
  var isValidated = 
      feedback &&
      feedback.userId &&
      feedback.subject &&
      feedback.type &&
      feedback.message;
  return isValidated;
};

/**
 * Validate ReportedAbuse resource object.
 * It must have a userId, issue and a description properties.
 * @param {ReportedAbuse} reportedAbuse The reported abuse object.
 * @return {Boolean} True if it's a valid reported abuse object. Otherwise, it's false.
 */
exports.reportedAbuse = function(reportedAbuse) {
  var isValidated = 
      reportedAbuse &&
      reportedAbuse.userId &&
      reportedAbuse.issue &&
      reportedAbuse.description;
  return isValidated;
};

/**
 * Validate FriendInvitation resource object.
 * It must have a userEmail, friendEmail, and message properties.
 * @param {FriendInvitation} friendInvitation The friend invitation object.
 * @return {Boolean} True if it's a valid friend invitation object. Otherwise, it's false.
 */
exports.friendInvitation = function(friendInvitation) {
  var isValidated = 
      friendInvitation &&
      friendInvitation.userEmail &&
      friendInvitation.friendEmail &&
      friendInvitation.message;
  return isValidated;
};
