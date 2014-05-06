'use strict';

var _ = require('lodash');

module.exports.deepFormatKeys = deepFormatKeys;

/**
 * Recursive function to format keys.
 *
 * @param {Function} formatter
 * @param {Object} object
 * @returns {Object}
 */
function deepFormatKeys(formatter, object) {
  if (! Array.isArray(object) && ! _.isPlainObject(object)) return object;

  if (Array.isArray(object)) return _.map(object, deepFormatKeys.bind(null, formatter));

  return Object.keys(object).reduce(function (mem, key) {
    var newKey = formatter(key);
    mem[newKey] = deepFormatKeys(formatter, object[key]);
    return mem;
  }, {});
}
