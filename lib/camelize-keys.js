'use strict';

var _s = require('underscore.string');
var formatKeys = require('format-keys');

/**
 * convert all obj keys to camel case
 */
module.exports = function (obj) {
  return formatKeys(obj, _s.camelize);
};
