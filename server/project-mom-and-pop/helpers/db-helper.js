/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * DB Helper.
 * This file is a wrapper for all methods that are related with database.
 */
var config = require('config');
var mongoose = require('mongoose');
var winston = require('winston');

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Get Mongoose instance.
 * @return {Mongoose} mongoose connection object.
 */
exports.getMongoose = function() {
  var url = config.get('MONGODB_URL');
  var poolSize = config.get('MONGODB_CONNECTION_POOL_SIZE');
  if (!url) {
    winston.error('MONGODB_URL variable does not exist in your configuration file!');
    return null;
  }
  if (!poolSize) {
    winston.error('MONGODB_CONNECTION_POOL_SIZE variable does not exist in your configuration file!');
    return null;
  }
  return mongoose.createConnection(url, { 
    server: { 
      poolSize: poolSize 
    }
  });
};
