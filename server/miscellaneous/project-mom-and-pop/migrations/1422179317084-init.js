var async = require('async');
var db = require('./../helpers/db-helper');
var mongoose = db.getMongoose();
var User = mongoose.model('User', require('./../models/user').UserSchema);
var OfferCategory = mongoose.model('OfferCategory', require('./../models/offerCategory').OfferCategorySchema);
var ActionType = mongoose.model('ActionType', require('./../models/actionType').ActionTypeSchema);
var FeedbackType = mongoose.model('FeedbackType', require('./../models/feedbackType').FeedbackTypeSchema);
var BusinessType = mongoose.model('BusinessType', require('./../models/businessType').BusinessTypeSchema);

exports.up = function(next){
  var models = [];
  models.push(new OfferCategory({ name: 'Steam Voucher' }));
  models.push(new OfferCategory({ name: 'iTunes Gift Card' }));
  models.push(new ActionType({ name: 'Gifting' }));
  models.push(new ActionType({ name: 'Redeem' }));
  models.push(new BusinessType({ name: 'Software' }));
  models.push(new BusinessType({ name: 'Manufacturing' }));
  models.push(new FeedbackType({ name: 'Suggestion' }));
  models.push(new FeedbackType({ name: 'Complaint' }));
  models.push(new User({ firstName: 'Johnny', lastName: 'Awesome', email: 'johnnyawesome.tc@gmail.com' }));
  
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
      if (!err) {
        next();
      }
    }
  );
};

exports.down = function(next){
  var models = [];
  models.push(OfferCategory);
  models.push(ActionType);
  models.push(FeedbackType);
  models.push(BusinessType);
  models.push(User);

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
      if (!err) {
        next();
      }
    }
  );
};
