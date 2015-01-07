'use strict';

var _ = require('lodash');

/**
* Format where expression.
*
* @param {string[]|string} keys
* @param {string[]|string} query
* @param {string[]|string} jsonkeys
*/

module.exports = function (keys, query, jsonkeys) {
  var where = _.omit(query, keys);

  /**
   * Omit all keys in 'where' who not value jonskeys[] + '.'
   * Exemple:
   *   where = {id :5, data.team: 456}
   *   jsonkeys = [data]
   * Result where = {data.team: 456} why data.team contains data.
  */
  where = _.omit(where, function(value, key) {
    var omit = true;
    _.each(jsonkeys, function(jsonkey) {
      if (jsonkey + '.' === key.substring(0, jsonkey.length + 1)) {
        omit = false;
      }
    });
    return omit;
  });

  var whereRaw = '';
  _.each(where, function(value, key) {
    var tab = key.split('.');

    if (!whereRaw) {
      whereRaw = tab[0] + "->>'" + tab[1] + "' = '" + value + "'";
    } else {
      whereRaw += ' AND ' + tab[0] + "->>'" + tab[1] + "' = '" + value + "'";
    }
  });

  return whereRaw;
};
