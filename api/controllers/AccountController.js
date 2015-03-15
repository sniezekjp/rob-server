/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');

module.exports = {
	all: function(req, res) {
    Account.find({limit:5}).exec(function(err, result) {
      res.json(result);
    });
  },
  import: function(req, res) {
    var waterfall = [];
    req.body.data.forEach(function(item) {
      waterfall.push(function(callback) {
        var split = item[1].split(',');
        var broker = {
          first: split[1].trim(),
          last: split[0].trim()
        };
        var account = {
          name: item[0].trim()
        };
        Broker.findOne(broker).exec(function(err, theBroker) {
          if(!theBroker) {
            Broker.create(broker).exec(function(err, broker) {
              account.broker = broker.id;
              Account.create(account).exec(function(err, account) {
                callback();
              });
            });            
          } else {
            account.broker = theBroker.id;
            Account.create(account).exec(function(err, account) {
              callback();
            });            
          }
        });        
      });
    });
    async.waterfall(waterfall, function() {
      res.json("Done importing");
    });
  }
};

