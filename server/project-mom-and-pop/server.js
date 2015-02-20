/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * The main entry-point.
 */
var bodyParser = require('body-parser');
var config = require('config');
var express = require('express');
var mongoose = require('mongoose');
var winston = require('winston');
var resp = require('./helpers/response-helper');
var routes = require('./routes.js');
var secured = require('./middlewares/secured');
var path = require('path');

///////////////////////
// PRIVATE VARIABLES //
///////////////////////
var app = express();
var dbUrl = config.get('MONGODB_URL');
var port = config.get('WEB_SERVER_PORT');

// Use body-parser module to parse json request body.
app.use(bodyParser.json());

// Check if the user is authorized to access some actions.
// NOTE: These are just stub functions, since the implementation is outside the scope of the challenge.
app.use(secured('miscellaneous'));
app.use(secured('lookup'));

// Route registration.
routes.register(app);

// Catch-all-0error response handler
app.use(resp.sendError);

// Start the server.
app.listen(port, function() {
  winston.info('App is listening on port %s', port);
});

app.use(express.static(path.join(__dirname, '../../build')));
