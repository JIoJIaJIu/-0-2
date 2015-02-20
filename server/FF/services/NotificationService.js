/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Notification service
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

/**
 * Send the notificaiton mail to user email address
 * @param     {String}        user email address
 * @param     {String}        reset password token
 */
exports.notifyUserOfPassword = function(email, token, callback) {
  // do something send notification mail. Currently it is dummy method
  // return null for error so that operation is successfull
  console.log("The notify email is: %s\nThe token is: %s\n", email, token);
  callback(null);
};
