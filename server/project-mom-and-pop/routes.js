/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * Routes configuration file.
 */
var _ = require('lodash');
var lookup = require('./controllers/lookup');
var miscellaneous = require('./controllers/miscellaneous');

/**
 * Routes configuration.
 * This variable is a collection of routes.
 * A route itself has 'method', 'path', and 'action'.
 *   - method: standard API methods in lower-case (e.g. 'get', 'post', etc2).
 *   - path: the route path. It must begin with a backslash (/).
 *   - action: the function that will be invoked when this route is called.
 */
var routes = [
  { method: 'get',    path: '/offerCategories',     action: lookup.getAllOfferCategories },
  { method: 'get',    path: '/actionTypes',         action: lookup.getAllActionTypes },
  { method: 'get',    path: '/feedbackTypes',       action: lookup.getAllFeedbackTypes },
  { method: 'get',    path: '/businessTypes',       action: lookup.getAllBusinessTypes },
  
  { method: 'post',   path: '/feedbacks',           action: miscellaneous.sendFeedback },
  { method: 'post',   path: '/abuses',              action: miscellaneous.reportAbuse },
  { method: 'post',   path: '/invitations',         action: miscellaneous.inviteFriend }
];

///////////////////////
// EXPOSED FUNCTIONS //
///////////////////////

/**
 * Register routes to Express app.
 * @param {Object} app The express app.
 */
exports.register = function(app) {
  _.forEach(routes, function(route) {
    app[route.method](route.path, route.action);
  });
};
