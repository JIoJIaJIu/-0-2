/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This Mock for GiftCardOfferService.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var GiftCardOfferService = {
    /**
     * Search gift card offer with criteria.
     * @param criteria {Object} the criteria
     * @param callback {Function<error:Error, result:SearchResult<GiftCardOffer>>} the callback function
     */
    search: function(criteria, callback) {

      if(criteria.businessId === "123"){
        callback(null, {
          id: "123",
          businessId: "123"
        });
      }else{
        callback(null, null);
      }
    }

};

module.exports = GiftCardOfferService;
