/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Represents configuration file.
 *
 * @version 1.0
 * @author TCSASSEMLBER
 */
"use strict";

module.exports = {

    //The MongoDB URL.
    MONGODB_URL: "mongodb://127.0.0.1:27017/project-mom",
    STATIC_URL: "http://localhost:8000",

    //The MongoDB connection pool size.
    MONGODB_CONNECTION_POOL_SIZE: 50,

    //The port number for API.
    WEB_SERVER_PORT: 3000,

    //The default sort by
    DEFAULT_SORT_BY: "id",

    //The default sort order
    DEFAULT_SORT_ORDER: "Ascending",

    //The default page size per page
    DEFAULT_PAGE_SIZE: 10,

    //The QR code size
    QR_CODE_SIZE: 16,

    //Default redeeme amount
    DEFAULT_REDEEME_AMOUNT: 20,

    //Default QR code file dir
    //Please note: put qrCode dir in 'public/i/' to make sure AngularJS can read it in web show
    QR_CODE_FILE_DIR: "public/i/qrcode/",

    "SALT_WORK_FACTOR": 1,
    "SESSION_TOKEN_DURATION": 50000000,
    "JWT_SECRET": "somesecret",
    "DEFAULT_TOKEN_SIZE": 16,
    "ACTIONS_INDIVIDUAL_USER": "users,giftCardOffers,revokeToken,resetPassword,giftCards",
    "ACTIONS_BUSINESS_EMPLOYEE": "users,giftCards,giftCardOffers",
    "ACTIONS_BUSINESS_ADMIN": "users,giftCards,giftCardOffers",
    "ACTIONS_CLIENT": "users, giftCards,giftCardOffers",
    "ACTIONS_PLATFORM_EMPLOYEE": "users,giftCards,giftCardOffers",
    "OFFER_EXPIRATION_DAYS": 1,
    "PROFILE_IMAGE_FOLDER": "./uploads",
    "TEMP_DIRECTROY": "./temp",
    "MERCHANT_ID": "ny6gyyt78bps3pqb",
    "PUBLIC_KEY": "xf72q3xmc6ywk55k",
    "PRIVATE_KEY": "3660ba0f71ee6ad0ea5923723d65a89b"

};
