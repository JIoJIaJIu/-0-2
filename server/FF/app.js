/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents main application file.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

var express = require('express'),
    winston = require('winston'),
    bodyParser = require('body-parser'),
    path = require('path'),
    config = require('./configs/config');


// Configure the logger
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: 'debug',
    timestamp: true
});


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var tokenParser = require('./middlewares/tokenParser'),
    formParser = require('./middlewares/formParser');

var options = {
    uploadDir: path.join(process.cwd(), config.TEMP_DIRECTROY)
};
app.use(formParser(options));
app.use(tokenParser());

app.use(require('./middlewares/router')());

app.use(express.static(path.join(__dirname, 'public')));


// Initial DB for testing
require('./test_files/initialDB.js')(true);

// Start the server
app.listen(config.WEB_SERVER_PORT);
winston.info('Express server listening on port ' + config.WEB_SERVER_PORT);
