/**
 * CallLogController
 *
 * @description :: Server-side logic for managing Calllogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
	import: function(req, res) {
    var waterfall = [];
    req.body.data.forEach(function(item) {
      waterfall.push(function(callback) {
        console.log(item);
        CustomAccount.find({
          name: {
            startsWith: item[2]
          }
        }).exec(function(err, accounts) {
            try {
              var firstWord = item[2].split(" ")[0];
            }
            catch (err){
              var firstWord = item[2]
            }
          Account.find({
            name: {
              startsWith: firstWord
            }
          }).exec(function(err, formalAccounts) {
            if(accounts.length) {
              CustomAccount.create({
                name: item[2],
                formal: formalAccounts.length ? formalAccounts[0].id : null
              }).exec(function(err, newCustomAccount) {
                var calllog = {
                  customAccount: newCustomAccount.id,
                  timeOfCall: new Date(item[0] + ' '+ item[1]),
                  contact: item[3],
                  organizer: item[4]
                }
                CallLog.create(calllog).exec(function(err, newCallLog) {
                  callback();
                });
              });
            } else {
              callback();
            }
          });
        });
      });
    });
    async.waterfall(waterfall, function() {
      res.json('done importing');
    });
  }
};

