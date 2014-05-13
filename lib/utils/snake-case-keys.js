'use strict';

var _s = require('underscore.string');
var formatKeys = require('format-keys');

/**
 * Convert all object keys to snake case keys.
 *
 * @param {Object} obj
 * @returns {Object}
 */

module.exports = function (obj) {
  return formatKeys(obj, _s.underscored);
};