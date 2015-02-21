(function () {
var config = {
    /**
    /* This configuration option specifies the base URL of the REST services.
     * Required. {String}
     * e.g. http://host.com/momandpop/
     *
     **/
    REST_SERVICE_BASE_URL: 'http://localhost:3000',

    /**
     * This is the message template for the friend invitation email.
     * Required. {String}
     * It may contain these parameters: %offer-id%, %business-id%, %business-name%, %business-type%, %business-address%, %business-picture%, %discount%.
     *
     **/
    FRIEND_INVITATION_MESSAGE_TEMPLATE: '',

    /**
     * This is LinkedIn application id used for OAuth2.
     * Required. {String}
     *
     **/
    LINKEDIN_APP_ID: '',

    /**
     * This is Facebook application ID used for OAuth2.
     * Required. {String}
     *
     **/
    FACEBOOK_APP_ID: '',

    /**
     * This is Twitter consumer key used for OAuth2.
     * Required. {String}
     *
     **/
    TWITTER_CONSUMER_KEY: '',

    /**
     * This is publisher key for ShareThis.
     * Required. {String}
     *
     **/
    SHARE_THIS_PUBLISHER_KEY: '',

    /**
     * This is period in seconds to refresh session token.
     * Optional. {Integer}. If not configured, no session token refresh is done.
     *
     **/

    SESSION_TOKEN_REFRESH_PERIOD: null
};

angular.module('MomAndPop.config', []).constant('CONFIG', config);

})();
