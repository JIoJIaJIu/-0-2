/**
 * Copyright (C) 2013 - 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0.0
 * @author CaptainChrno
 */
'use strict';

/**
 * The test for notification module.
 * It is recommended to use alternate database for unit-testing, since database is wiped out after each unit testing.
 */
var async = require('async');
var express = require('express');
var should = require('should');
var request = require('supertest')('http://localhost:10100');
var winston = require('winston');
var db = require('./../helpers/db-helper');
var mongoose = db.getMongoose();
var User = mongoose.model('User', require('./../models/user').UserSchema);
var notificationService = require('./../services/notification');

/**
 * Generate Test Data
 */
var resetPasswordEmail, resetPasswordToken;
var validFeedback, incompleteFeedback, noUserFeedback;
var validReportedAbuse, incompleteReportedAbuse, noUserReportedAbuse;
var validFriendInvitation, incompleteFriendInvitation;
var deletedContentUserId, invalidDeletedContentUserId, deletedContentContent;
var testedUserId;

function _initData(done) {
  // Feedback Test Data
  validFeedback = {
    type: 'Suggestion',
    subject: 'Site improvement',
    message: 'Use color please',
    userId: testedUserId
  };
  incompleteFeedback = {
    type: 'Suggestion',
    subject: 'Site improvement',
    userId: testedUserId
  };
  noUserFeedback = {
    type: 'Suggestion',
    subject: 'Site improvement',
    message: 'Use color please',
    userId: '12345c6c9963bbc0602eb45a'
  };

  // Reported Abuse Test Data
  validReportedAbuse = {
    issue: 'Foul Language',
    description: 'Someone is using foul language',
    userId: testedUserId,
    commentId: '385',
    giftCardOfferId: '275'
  };
  incompleteReportedAbuse = {
    userId: testedUserId,
    commentId: '385',
    giftCardOfferId: '275'
  };
  noUserReportedAbuse = {
    issue: 'Foul Language',
    description: 'Someone is using foul language',
    userId: '12345c6c9963bbc0602eb45a',
    commentId: '385',
    giftCardOfferId: '275'
  };

  // Friend Invitation Test Data
  validFriendInvitation = {
    userEmail: 'kend654@gmail.com',
    friendEmail: 'permagate@gmail.com',
    message: 'You are invited! I will take care of you!'
  };
  incompleteFriendInvitation = {
    userEmail: 'kend654@gmail.com',
    message: 'You are invited! I will take care of you!'
  };

  // Reset Password Test Data
  resetPasswordEmail = 'permagate@gmail.com';
  resetPasswordToken = 'iawjdioajdawlidmawlidm';
  
  // Deleted Content Test Data
  deletedContentUserId = testedUserId;
  deletedContentContent = 'Microsoft Shop Gift is deleted!';
  invalidDeletedContentUserId = '12345c6c9963bbc0602eb45a';
  
  done();
}

/**
 * Clear database
 */
function _clearDB(done) {
  User.remove({}, function(err) {
    if (err) {
      done(err);
    } else {
      winston.info('mom-and-pop-db collections are cleared!');
      done();
    }
  });
}

/**
 * Initialize database
 */
function _initDB(done) {
  var testedUser = new User({ firstName: 'Johnny', lastName: 'Awesome', email: 'kend654@gmail.com' });
  testedUser.save(function(err, createdUser) {
    if (err) {
      done(err);
    } else {
      testedUserId = createdUser.id;
      winston.info('mom-and-pop-db collections are populated!');
      done();
    }
  });
}

/**
 * Start testing
 */
describe('Miscellaneous component', function() {
  before(function(done) {
    async.series([_clearDB, _initDB, _initData], function(err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });
  
  after(function(done) {
    _clearDB(done);
  });
  
  describe('POST /feedbacks', function() {
    it('should respond with 400 if some required parameters are missing', function(done) {
      request.post('/feedbacks')
        .send(incompleteFeedback)
        .expect(400)
        .end(done);
    });
    
    it('should respond with 404 if the user id does not exist in the database', function(done) {
      request.post('/feedbacks')
      .send(noUserFeedback)
      .expect(404)
      .end(done);
    });
  });
  
  describe('POST /abuses', function() {
    it('should respond with 400 if some required parameters are missing', function(done) {
      request.post('/abuses')
      .send(incompleteReportedAbuse)
      .expect(400)
      .end(done);
    });

    it('should respond with 404 if the user id does not exist in the database', function(done) {
      request.post('/abuses')
      .send(noUserReportedAbuse)
      .expect(404)
      .end(done);
    });
  });
  
  describe('POST /invitations', function() {
    it('should respond with 400 if some required parameters are missing', function(done) {
      request.post('/feedbacks')
      .send(incompleteFriendInvitation)
      .expect(400)
      .end(done);
    });

    it('should respond with 404 if the user id does not exist in the database', function(done) {
      request.post('/feedbacks')
      .send(noUserFeedback)
      .expect(404)
      .end(done);
    });
  });
  
  describe('notifyUserOfDeletedContent function', function() {
    it('should return error 404 if the user id does not exist in the database', function(done) {
      notificationService.notifyUserOfDeletedContent(invalidDeletedContentUserId, deletedContentContent, function(err) {
        err.statusCode.should.equal(404);
        done();
      });
    });
  });
});
