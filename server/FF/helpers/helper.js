/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
'use strict';

/**
 * This module contains helper functions.
 *
 * @author TCSASSEMLBER
 * @version 1.0
 */

var GIFT_CARD_STATUS = {
    ACTIVE: 'ACTIVE',
    FOR_RESALE: 'FOR_RESALE',
    INACTIVE: 'INACTIVE'
};

var GIFT_CARD_OFFER_STATUS = {
    CANCELLED: 'CANCELLED',
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    ENDED: 'ENDED'
};

var tester = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;


var _ = require('underscore');
var ValidationError = require('../errors/ValidationError');

var helper = {};

/**
 * Export HTTP STATUS CODES
 */
helper.HTTP_OK = 200;
helper.HTTP_CREATED = 201;
helper.HTTP_INTERNAL_SERVER_ERROR = 500;
helper.HTTP_BAD_REQUEST = 400;
helper.HTTP_UNAUTHORIZED = 401;
helper.HTTP_FORBIDDEN = 403;
helper.HTTP_NOT_FOUND = 404;
helper.HTTP_DELETED = 204;

/**
 * Validate that given value is a valid String
 *
 * @param  {String}           val      String to validate
 * @param  {String}           name     name of the string property
 * @return {Error/Undefined}           Error if val is not a valid String otherwise undefined
 */
helper.checkString = function(val, name) {
    if (!_.isString(val)) {
        return new ValidationError(name + ' should be a valid string');
    }
};

/**
 * Validate the given is a valid email address
 * @param {String}    email         email to validate
 * @param {String}    name          name of the email property field
 */
helper.checkEmail = function(email, name) {
    if (!_.isString(email)) {
        return new ValidationError(name + ' is invalid');
    }
    if (email.length > 254) {
        return new ValidationError(name + ' cannot be greater than 254 characters');
    } else if (!tester.test(email)) {
        return new ValidationError(name + ' is invalid');
    }
};

 /**
  * Validate that given value is a valid Date
  *
  * @param  {Date/String}           val      Date to validate
  * @param  {String}                name     name of the Date property
  * @return {Error/Undefined}                Error if val is not a valid String otherwise undefined
  */
helper.checkDate = function(val, name) {
    // string representation of date
    if (_.isString(val)) {
        var date = new Date(val);
        if (!_.isDate(date)) {
            return new ValidationError(name + ' should be a valid String representation of Date');
        }
    } else {
        if (!_.isDate(val)) {
            return new ValidationError(name + ' should be a valid Date');
        }
    }
};

 /**
  * Validate that given value is a valid positive number
  *
  * @param  {Number}                val      Number to validate
  * @param  {String}                name     name of the Date property
  * @return {Error/Undefined}                Error if val is not a valid String otherwise undefined
  */
helper.checkPositiveNumber = function(val, name) {
    val = parseInt(val);
    if (!_.isNumber(val) || isNaN(val)) {
        return new ValidationError(name + ' should be a valid number');
    } else if (val < 0) {
        return new ValidationError(name + ' should be a valid positive number');
    }
};

 /**
  * Validate that given obj is defined
  *
  * @param  {Object}                val      Object to validate
  * @param  {String}                name     name of the Date property
  * @return {Error/Undefined}                Error if val is not a valid String otherwise undefined
  */
helper.checkDefined = function(obj, name) {
    if (_.isUndefined(obj)) {
        return new ValidationError(name + ' should be defined');
    }
};



helper.getOrder = function(order) {
    return order === 'Ascending' ? 1 : -1;
};


helper.validatePageSize = function(pageSize, error) {
    pageSize = parseInt(pageSize);
    if (isNaN(pageSize) || pageSize < 1) {
        error.Err = new Error("pageSize should be positive integer.");
        return false;
    }

    return true;
};


helper.validatePageNumber = function(pageNumber, error) {
    pageNumber = parseInt(pageNumber);
    if (isNaN(pageNumber) || pageNumber < 0) {
        error.Err = new Error("pageNumber should be non-negative integer.");
        return false;
    }

    return true;
};


helper.validateOrderBy = function(orderBy, error) {
    var allowed = ['id', 'ownerId', 'businessId', 'businessName', 'businessAddress',
        'businessPicture', 'businessTelephone', 'discount', 'quantity', 'status',
        'giftCardOfferId', 'expirationDate', 'activationDateTime', 'endDateTime'
    ];

    if (allowed.indexOf(orderBy) === -1) {
        error.Err = new Error("sortBy should be in: [" + allowed.join(', ') + "]");
        return false;
    }

    return true;
};


helper.validateOrder = function(order, error) {
    var allowed = ['Ascending', 'Descending'];
    if (allowed.indexOf(order) === -1) {
        error.Err = new Error("sortOrder should be in: [" + allowed.join(', ') + "]");
        return false;
    }

    return true;
};


helper.validateStatus = function(statuses, error) {
    if (statuses === undefined) {
        return true;
    }

    var items = statuses.split(",");

    for (var i = 0; i < items.length; i++) {
        if (!GIFT_CARD_STATUS[helper.trim(items[i])]) {
            error.Err = new Error("Status must be in [ACTIVE, FOR_RESALE, INACTIVE], and array format should be xxx,xxx,xxx");
            return false;
        }
    }

    return true;
};

helper.validateGiftCardOfferStatus = function(statuses, error) {
    if (statuses === undefined) {
        return true;
    }

    var items = statuses.split(",");

    for (var i = 0; i < items.length; i++) {
        if (!GIFT_CARD_OFFER_STATUS[helper.trim(items[i])]) {
            error.Err = new Error("Status must be in [CANCELLED, DRAFT, ACTIVE, ENDED], and array format should be xxx,xxx,xxx");
            return false;
        }
    }

    return true;
};


helper.trim = function(str) {
    return String(str).replace(/^\s+|\s+$/g, '');
};


helper.validateFloatRangeNumber = function(rangeNumbers, error) {
    if (rangeNumbers === undefined) {
        return true;
    }

    var nums = rangeNumbers.split(",");
    if (nums.length !== 2) {
        error.Err = new Error("Range number format should be like: xxx,xxx");
        return false;
    }

    var num1 = parseFloat(nums[0]);
    var num2 = parseFloat(nums[1]);

    if (isNaN(num1) || isNaN(num2)) {
        error.Err = new Error("Range number should be valid float.");
        return false;
    }

    return true;
};


helper.validateIntRangeNumber = function(rangeNumbers, error) {
    if (rangeNumbers === undefined) {
        return true;
    }

    var nums = rangeNumbers.split(",");
    if (nums.length !== 2) {
        error.Err = new Error("Range number format should be like: xxx,xxx");
        return false;
    }

    var num1 = parseInt(nums[0]);
    var num2 = parseInt(nums[1]);

    if (isNaN(num1) || isNaN(num2)) {
        error.Err = new Error("Range number should be valid int.");
        return false;
    }

    return true;
};


helper.validateRangeDate = function(rangeDates, error) {
    if (rangeDates === undefined) {
        return true;
    }

    error.Err = new Error("Range date format should be like: YYYY-MM-DD,YYYY-MM-DD");

    var dates = rangeDates.split(",");
    if (dates.length !== 2) {
        return false;
    }

    var dateFormat = /(\d{4})-(\d{1,2})-(\d{1,2})/;
    if (dateFormat.exec(dates[0]) && dateFormat.exec(dates[1])) {
        var d1 = new Date(dates[0]);
        var d2 = new Date(dates[1]);

        if (d1.toString() !== 'Invalid Date' && d2.toString() !== 'Invalid Date') {
            if (d1 <= d2) {
                return true;
            }

            error.Err = new Error("StartDate should be before EndDate");
            return false;
        }
    }

    return false;
};


helper.validateRequiredParameter = function(paramValue, paramName, error) {
    if (!paramValue) {
        error.Err = new Error("Required query parameter '" + paramName + "' is missing.");
        return false;
    }

    return true;
};

helper.validateRequiredIntParameter = function(paramValue, paramName, error) {
    if (!helper.validateRequiredParameter(paramValue, paramName, error)) {
        return false;
    }

    if (isNaN(parseInt(paramValue))) {
        error.Err = new Error(paramName + " should be an Integer but '" + paramValue + "' was provided.");
        return false;
    }

    return true;
};


helper.validateRequiredFloatParameter = function(paramValue, paramName, error) {
    if (!helper.validateRequiredParameter(paramValue, paramName, error)) {
        return false;
    }

    if (isNaN(parseFloat(paramValue))) {
        error.Err = new Error(paramName + " should be an Float but '" + paramValue + "' was provided.");
        return false;
    }

    return true;
};


helper.validateRequiredStatusParameter = function(paramValue, paramName, error) {
    if (!helper.validateRequiredParameter(paramValue, paramName, error)) {
        return false;
    }

    if (!GIFT_CARD_STATUS[helper.trim(paramValue)]) {
        error.Err = new Error(paramName + " must be in [ACTIVE, FOR_RESALE, INACTIVE]");
        return false;
    }

    return true;
};


module.exports = helper;
