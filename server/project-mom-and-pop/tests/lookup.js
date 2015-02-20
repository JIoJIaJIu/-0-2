/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * The test for lookup module.
 * It is recommended to use alternate database for unit-testing, since database is wiped out after each unit testing.
 */
var async = require('async');
var express = require('express');
var should = require('should');
var sinon = require('sinon');
var winston = require('winston');
var request = require('supertest')('http://localhost:10100');
var db = require('./../helpers/db-helper');
var mongoose = db.getMongoose();
var OfferCategory = mongoose.model('OfferCategory', require('./../models/offerCategory').OfferCategorySchema);
var ActionType = mongoose.model('ActionType', require('./../models/actionType').ActionTypeSchema);
var FeedbackType = mongoose.model('FeedbackType', require('./../models/feedbackType').FeedbackTypeSchema);
var BusinessType = mongoose.model('BusinessType', require('./../models/businessType').BusinessTypeSchema);

/**
 * Clear database
 */
function _clearDB(done) {
  var models = [];
  models.push(OfferCategory);
  models.push(ActionType);
  models.push(FeedbackType);
  models.push(BusinessType);
  
  async.eachSeries(
    models, 
    function(model, callback) {
      model.remove({}, function(err) {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    }, 
    function(err) {
      if (err) {
        done(err);
      } else {
        winston.info('mom-and-pop-db collections are cleared!');
        done();
      }
    }
  );
}

/**
 * Initialize database
 */
function _initDB(done) {
  var models = [];
  models.push(new OfferCategory({ name: 'Steam Voucher' }));
  models.push(new OfferCategory({ name: 'iTunes Gift Card' }));
  models.push(new ActionType({ name: 'Gifting' }));
  models.push(new ActionType({ name: 'Redeem' }));
  models.push(new BusinessType({ name: 'Software' }));
  models.push(new BusinessType({ name: 'Manufacturing' }));
  models.push(new FeedbackType({ name: 'Suggestion' }));
  models.push(new FeedbackType({ name: 'Complaint' }));

  async.eachSeries(
    models, 
    function(model, callback) {
      model.save(function(err) {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    }, 
    function(err) {
      if (err) {
        done(err);
      } else {
        winston.info('mom-and-pop-db collections are populated!');
        done();
      }
    }
  );
}

/**
 * Start testing
 */
describe('Lookup component', function() {
  before(function(done) {
    _clearDB(function() {
      _initDB(done);
    });
  });
  
  after(function(done) {
    _clearDB(done);
  });
  
  describe('GET /offerCategories', function() {
    it('should respond with 200 and returns 2 offer categories if there is no error', function(done) {
      request.get('/offerCategories')
        .expect(200)
        .expect(function(res) { res.body.length.should.equal(2) })
        .end(done);
    });
    
    it('should respond with 500 if database error happens', function(done) {
      var stub = sinon.stub(OfferCategory, "find").throws();
      request.get('/offerCategories')
        .expect(500)
        .end(function(err) {
          OfferCategory.find.restore();
          done();
        });
    });
  });
  
  describe('GET /actionTypes', function() {
    it('should respond with 200 and returns 2 action types if there is no error', function(done) {
      request.get('/actionTypes')
      .expect(200)
      .expect(function(res) { res.body.length.should.equal(2) })
      .end(done);
    });
    
    it('should respond with 500 if database error happens', function(done) {
      var stub = sinon.stub(ActionType, "find").throws();
      request.get('/actionTypes').expect(500);
      ActionType.find.restore();
      done();
    });
  });

  describe('GET /feedbackTypes', function() {
    it('should respond with 200 and returns 2 feedback types if there is no error', function(done) {
      request.get('/feedbackTypes')
      .expect(200)
      .expect(function(res) { res.body.length.should.equal(2) })
      .end(done);
    });
    
    it('should respond with 500 if database error happens', function(done) {
      var stub = sinon.stub(FeedbackType, "find").throws();
      request.get('/feedbackTypes').expect(500);
      FeedbackType.find.restore();
      done();
    });
  });
  
  describe('GET /businessTypes', function() {
    it('should respond with 200 and returns 2 business types if there is no error', function(done) {
      request.get('/businessTypes')
      .expect(200)
      .expect(function(res) { res.body.length.should.equal(2) })
      .end(done);
    });
    
    it('should respond with 500 if database error happens', function(done) {
      var stub = sinon.stub(BusinessType, "find").throws();
      request.get('/businessTypes').expect(500);
      BusinessType.find.restore();
      done();
    });
  });
});
