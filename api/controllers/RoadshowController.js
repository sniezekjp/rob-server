

var async = require('async');
module.exports = {
  import: function(req, res) {
    var waterfall = [];
    req.body.data.forEach(function(item) {
      waterfall.push(function(callback) {
        console.log(item);
        CustomAccount.find({
          name: {
            startsWith: item[3]
          }
        }).exec(function(err, accounts) {
            try {
              var firstWord = item[3].split(" ")[0];
            }
            catch (err){
              var firstWord = item[3]
            }
          Account.find({
            name: {
              startsWith: firstWord
            }
          }).exec(function(err, formalAccounts) {
            if(accounts.length) {
              CustomAccount.create({
                name: item[3],
                formal: formalAccounts.length ? formalAccounts[0].id : null
              }).exec(function(err, newCustomAccount) {
                var roadshow = {
                  customAccount: newCustomAccount.id,
                  datetime: new Date(item[0]),
                  city: item[1],
                  meetingType: item[2],
                  attendees: item[4],
                  broker: item[5],
                  salesCityCoverage: item[6]
                }
                Roadshow.create(roadshow).exec(function(err, newRoadshow) {
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