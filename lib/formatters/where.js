'use strict';

var _ = require('lodash');
var snakeCaseKeys = require('../utils/snake-case-keys');

/**
* Format where expression.
*
* @param {string[]|string} keys Array of keys to omit in query
* @param {object} query Array of parameter to use in where
* @param {string[]|string} jsonkeys Array of json keys to omit in query
*/

module.exports = function (keys, query, jsonkeys) {
  var where = _.omit(query, keys);

  /**
  * Omit all keys in 'where' that are not value jsonkeys[] + '.'
  * Exemple:
  *   where = {id :5, data.team: 456}
  *   jsonkeys = [data]
  * Result where = {id: 5} why data.team contains data.
  */
  where = _.reduce(where, function(result, value, key) {
    if (!_.contains(jsonkeys, key.split('.')[0])) {
      result[key] = value;
    }
    return result;
  }, {});

  return snakeCaseKeys(where);
};
