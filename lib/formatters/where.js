var _ = require('lodash');
var snakeCaseKeys = require('../utils/snake-case-keys');

/**
 * Format where expression.
 *
 * @param {string[]|string} keys
 */

module.exports = function (keys, query) {
  var where = _.omit(query, keys);
  return snakeCaseKeys(where);
};