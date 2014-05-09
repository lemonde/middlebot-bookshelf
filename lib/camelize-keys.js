'use strict';

var _s = require('underscore.string');
var formatKeys = require('format-keys');

/**
 * convert all keys to camel case
 *
 * @param {string} options.key the key to camel case
 */
module.exports = function (options) {
  return function (req, res, next) {
    req[options.key] = formatKeys(req[options.key], _s.camelize);
    next();
  };
};
