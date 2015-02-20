'use strict';

/**
 * Wrapper around node-formidable module.
 * It exposes the node-formidable module functionality as a middleware
 * This middleware only parses multipart form data
 */

var formidable = require('formidable'),
  options,
  REGISTER_PATH = '/register',
  POST_REQUEST = 'post';

var middleware = function(req, res, next) {
  // let this middleware execute only for POST requests and register url
  if(req.method.toLowerCase() === POST_REQUEST && req.url === REGISTER_PATH) {
    var form = new formidable.IncomingForm(options);
    form.parse(req, function(err, fields, files) {
      if(err) {
        // error will be processed by global error handler
        next(err);
      } else {
        // set req.fields and req.files
        req.fields = fields;
        req.files = files;
        next();
      }
    });
  } else {
    next();
  }
};

module.exports = function(opts) {
  options = opts;
  return middleware;
};
