/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
"use strict";

/**
 * This module is used for create main router.
 *
 * @author TCSASSEMLBER
 * @version 1.0
 */

var express = require('express'),
    routes = require("../configs/routes");
    var auth = require('./auth');
    var _ = require('underscore');
    // var path = require('path');


/**
 * Load the routes from configs
 *
 * @param  {Object}  router        Express router instance
 */
var loadRoutes = function(router) {
    // load all public routes
    _.each(_.keys(routes.public), function(route) {
        var action = routes.public[route],
            httpMethod = route.split(/\s+/).shift().toLowerCase(),
            url = route.split(/\s+/).pop(),
            controllerName = action.split('#').shift(),
            controllerMethod = action.split('#').pop(),
            controller = require('../controllers/' + controllerName);
        router[httpMethod](url, controller[controllerMethod]);

        // console.log(httpMethod, url, controllerName, controllerMethod);
    });

    // load all authentic routes
    _.each(_.keys(routes.authentic), function(route) {
        var action = routes.authentic[route],
            httpMethod = route.split(/\s+/).shift().toLowerCase(),
            url = route.split(/\s+/).pop(),
            controllerName = action.split('#').shift(),
            controllerMethod = action.split('#').pop(),
            controller = require('../controllers/' + controllerName),
            authAction = url.split('/').slice(0, 2).join('');

        router[httpMethod](url, auth(authAction), controller[controllerMethod]);
    });

};


/**
 * Module exports
 *
 * @return {Router}             Express router instance
 */
module.exports = function() {
    // Instantiate an isolated express Router instance
    var router = express.Router();

    // configure router instance
    loadRoutes(router);

    return router;
};
