/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Mail Helper.
 * This file is a wrapper for all methods that are related with emails.
 */
var config = require('config');
var fs = require('fs');
var jade = require('jade');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var _emailTemplatesPath = './views/email_templates/';

/**
 * Get nodemailer transporter for sending emails.
 * @return {smtpTransport} an smtp transport object to send emails.
 */
function _getTransporter() {
  return nodemailer.createTransport(smtpTransport({
    host: config.get('SMTP_HOST'),
    port: config.get('SMTP_PORT'),
    auth: {
      user: config.get('SMTP_USERNAME'),
      pass: config.get('SMTP_PASSWORD')
    }
  }));
}

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Render email template from jade templates.
 * @param {String} templateName The jade template filename you want to render. If the filename invite-friend.jade, it should be 'invite-friend'.
 * @param {Object} context The object that you want to interpolate to the template.
 * @param {Function} callback The callback function <error: Error, html: String>.
 */
exports.renderEmailTemplate = function(templateName, context, callback) {
  var filePath = _emailTemplatesPath + templateName + '.jade';
  fs.readFile(filePath, 'utf8', function(err, file) {
    if (err) {
      callback(err);
    } else {
      var compiledTemplate = jade.compile(file, {filename: filePath});
      var mailContext = context;
      var html = compiledTemplate(mailContext);
      callback(null, html);
    }
  });
};

/**
 * Send mail function. 
 * @param {String} from The sender of the email.
 * @param {String} to The receiver of the email. It should be a valid email.
 * @param {String} subject The subject of the email.
 * @param {String} html The content of the email in html format.
 * @param {Function} callback The callback function <error: Error>. 
 */
exports.sendMail = function(from, to, subject, html, callback) {
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html
  };
  var transporter = _getTransporter();
  transporter.sendMail(mailOptions, callback);
};
