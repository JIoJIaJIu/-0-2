/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Helper method to perform logging
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';

var winston = require('winston');
var _ = require('underscore');
var async = require('async');

/**
 * Log error
 * @param {String} signature the signature to log
 * @param {Object} error
 */
function logError(signature, error) {
    var objToLog;
    if (error instanceof Error) {
        //stack contains error message
        objToLog = error.stack || error.toString();
    } else {
        objToLog = JSON.stringify(error);
    }
    winston.error(signature, objToLog);
}

/**
 * Log error to the console and call original callback without error.
 * It can be used for async.forEach
 * @param {String} signature the signature of calling method
 * @param {Function} callback
 * @returns {Function} the wrapped function
 */
function logAndIgnoreError(signature, callback) {
    return function (err) {
        if (err) {
            logError(signature, err);
        }
        callback();
    };
}

/**
 * Handle error and return it as JSON to the response.
 * @param {Error} error the error to handle
 * @param {Object} res the express response object
 * @returns {Object} the returned response
 */
function handleError(error, res) {
    var statusCode = error.code || 500;
    var errorMsg = error.message || JSON.stringify(error);
    var result = {
        error: errorMsg
    };
    res.status(statusCode).json(result);
    return result;
}

/**
 * Log response and error
 * @param {Error} error the error to handle
 * @param {Object} res the express response object
 */
function logResponseAndError(error, res) {
    var response = handleError(error, res);
    winston.error(response);
}

/**
 * This function create a delegate for the express action.
 * Input and output logging is performed.
 * Errors are handled and proper http status code is set.
 * Wrapped method must always call the callback function, first param is error, second param is object to return
 * @param {String} signature the signature of the method caller
 * @param {Function} fn the express method to call. It must have signature (req, res, callback)
 * or (req, callback) or (callback).
 * @returns {Function} the wrapped function
 * @since 1.1
 */
function wrapExpress(signature, fn) {
    if (!_.isString(signature)) {
        throw new Error('signature should be a string');
    }
    if (!_.isFunction(fn)) {
        throw new Error('fn should be a function');
    }
    return function(req, res) {
        var paramsToLog, paramsCloned = {},
            prop, clone;
        //clone properties, because wrapped method can modify them
        clone = function(obj) {
            return JSON.parse(JSON.stringify(obj));
        };
        //req.params is custom object and must be cloned only in this way
        for (prop in req.params) {
            if (req.params.hasOwnProperty(prop)) {
                paramsCloned[prop] = req.params[prop];
            }
        }
        paramsToLog = {
            requet: {
                body: clone(req.body),
                params: paramsCloned,
                query: clone(req.query),
                url: req.url
            }
        };

        winston.debug('ENTER %s', signature, paramsToLog);
        async.waterfall([
            function(cb) {
                try {
                    if (fn.length === 3) {
                        fn(req, res, cb);
                    } else if (fn.length === 2) {
                        fn(req, cb);
                    } else {
                        fn(cb);
                    }
                } catch (e) {
                    cb(e);
                }
            },
            function(result, resStatus) {
                winston.debug('EXIT %s', signature, {
                    response: result
                });
                if(resStatus){
                    res.status(resStatus);
                }
                res.json(result);
            }
        ], function(error) {
            var response = handleError(error, res);
            paramsToLog.response = response;
            paramsToLog.error = error.stack;
            winston.error('EXIT %s\n', signature, paramsToLog);
        });
    };
}


module.exports = {
    logError: logError,
    logAndIgnoreError: logAndIgnoreError,
    logResponseAndError: logResponseAndError,
    wrapExpress: wrapExpress,
    handleError: handleError
};
