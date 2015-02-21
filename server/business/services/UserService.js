/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This Mock for UserService.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var user1 = {
    "firstName": "firstName1",
    "lastName": "lastName1",
    "email": "email1",
    "location": "location1",
    "picture": "picture1",
    "isFirstNamePublic": true,
    "isLastNamePublic": true,
    "isEmailPublic": true,
    "isLocationPublic": true,
    "isPicturePublic": true,
    "userRoles": [{
        "businessId": "54c1b1a39d64e6006666aaaa",
        "role": "BUSINESS_EMPLOYEE"
    }, {
        "businessId": "54c1b1a39d64e6006666aaab",
        "role": "INDIVIDUAL_USER"
    }]
};

var UserService = {
    /**
     * Mock Search method.
     * @param criteria {criteria} the criteria
     * @param callback {Function<error:String, result:SearchResult<User>>} the callback function
     */
    search: function(criteria, callback) {
        var result = {
            totalPages: 1,
            pageNumber: 1,
            totalRecords: 1,
            items: [user1]
        };

        callback(null, result);
    },

    /**
     * Mock create method.
     * @param user {User} the user
     * @param callback {Function<error:String, result:User>} the callback function
     */
    create: function(user, callback) {
        callback(null, user1);
    },

    /**
     * Mock delete method.
     * @param id {User} the user id
     * @param callback {Function<error:String, result:User>} the callback function
     */
    delete: function(id, callback) {
        callback(null, user1);
    },

    /**
     * Mock update method.
     * @param user {User} the user to update
     * @param callback {Function<error:String, result:User>} the callback function
     */
    update: function(user, callback) {
        callback(null, user1);
    }

};

module.exports = UserService;
