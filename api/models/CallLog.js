/**
* CallLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

// module.exports.blueprints = {
// 	defaultLimit: 75,
// }

module.exports = {

  migrate: 'safe',
  
  attributes: {
    customAccount: {
      model: 'customaccount'
    }
  }
};

