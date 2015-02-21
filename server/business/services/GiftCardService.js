/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This Mock for GiftCardService.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
"use strict";

var GiftCardService = {
    /**
     * Search gift card with criteria.
     * @param criteria {Object} the criteria
     * @param callback {Function<error:Error, result:SearchResult<GiftCard>>} the callback function
     */
    search: function(criteria, callback) {

      if(criteria.businessId === "456"){
        callback(null, {
          id: "456",
          businessId: "456"
        });
      }else{
        callback(null, null);
      }
    }

};

module.exports = GiftCardService;
