'use strict';

var _ = require('lodash');
var snakeCaseKeys = require('../utils/snake-case-keys');

/**
* Format where expression.
*
* @param {string[]|string} keys
*/

module.exports = function (keys, query, jsonkeys) {
  var where = _.omit(query, keys);
  where = _.omit(where, function(value, key) {
    var omit = false;
    _.each(jsonkeys, function(jsonkey) {
      if (jsonkey + '.' == key.substring(0, jsonkey.length + 1)) {
        omit = true;
      }
    });
    return omit;
  });

  return snakeCaseKeys(where);
};
