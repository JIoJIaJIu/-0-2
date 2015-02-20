/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * BusinessService
 * This class exports the contract methods between Business Model and controllers
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
'use strict';

/* Globals */
var Business = require("../models/index").Business;

var async = require('async');
var NotFoundError = require('../errors/NotFoundError');

/**
 * Fetch a business entity by id.
 * If no entity matches the given id than a 404 error message will be passed as error to callback function
 *
 * @param  {UUID}       id        Mongoose document UUID
 * @param  {Function}   callback  callback function
 */
exports.get = function(id, callback) {
    async.waterfall([
        function(cb) {
            Business.findOne({
                _id: id
            }, cb);
        },
        function(business, cb) {
            if (business) {
                cb(null, business);
            } else {
                cb(new NotFoundError('Business not found'));
            }
        }
    ], callback);

};

/**
 * Fetch all business entities
 *
 * @param  {Function}   callback  callback function
 */
exports.getAll = function(callback) {
    Business.find(callback);
};

/**
 * Fetch a business entity by id.
 *
 * @param  {Object}       entity        Business entity to create
 * @param  {Function}     callback      callback function
 */
exports.create = function(entity, callback) {
    Business.create(entity, callback);
};

/**
 * Get business coordinates from address
 *
 * @param  {String}       address         Business address
 * @param  {Function}     callback        Callback function
 */
exports.getCoordinateByAddress = function(address, callback) {
    // dummy implementation
    var minLat = -90.00;
    var maxLat = 90.00;
    var latitude = minLat + (Math.random() * ((maxLat - minLat) + 1));
    var minLon = 0.00;
    var maxLon = 180.00;
    var longitude = minLon + (Math.random() * ((maxLon - minLon) + 1));
    var coordinates = [latitude, longitude];
    callback(null, coordinates);
};
