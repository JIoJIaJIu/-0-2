/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents configuration file.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var braintree = require("braintree");

module.exports = {

    //The MongoDB URL.
    MONGODB_URL: "mongodb://127.0.0.1:27017/project-mom",

    //The MongoDB connection pool size.
    MONGODB_CONNECTION_POOL_SIZE: 50,

    //The port number for API.
    WEB_SERVER_PORT: process.env.PORT || 3003,

    //The default sort by
    DEFAULT_SORT_BY: "id",

    //The default sort order
    DEFAULT_SORT_ORDER: "Ascending",

    //The default page size per page
    DEFAULT_PAGE_SIZE: 5,

    //The braintree gateway config
    BRAINTREE_GATEWAY_CONFIG: {
        environment: braintree.Environment.Sandbox,
        merchantId: "hkjdyyxzrjrws9yp",
        publicKey: "82kj86whcrhykh7v",
        privateKey: "d5000088ae06646ed0f6b64e5ffa479a"
    },

    //The braintree subscription planId
    BRAINTREE_SUBSCRIPTION_PLANID: "mf2m",

    //Geocoder Provider
    "GEOCODER_PROVIDER": "google",

    //Geocoder HttpAdapter
    "GEOCODER_HTTPADAPTER": "http"

};
