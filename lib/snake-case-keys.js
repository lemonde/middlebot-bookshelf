'use strict';

var _s = require('underscore.string');
var formatKeys = require('format-keys');

/**
 * convert all keys to snake case
 *
 * @param {string} options.key the key to snake case
 */
module.exports = function (options) {
  return function (req, res, next) {
    req[options.key] = formatKeys(req.where, _s.underscored);
    next();
  };
};
