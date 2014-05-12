'use strict';

var _s = require('underscore.string');
var formatKeys = require('format-keys');

/**
 * convert all obj keys to snake case
 */
module.exports = function (obj) {
  return formatKeys(obj, _s.underscored);
};
