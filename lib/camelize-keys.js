'use strict';

var _ = require('lodash');
var _s = require('underscore.string');

var utils = require('./utils');

/**
 * convert all keys to camel case
 *
 * @param {string} options.key the key to camel case
 */
module.exports = function (options) {
  return function (req, res, next) {
    req[options.key] = _.partial(utils.deepFormatKeys, _s.camelize)(req[options.key]);
    next();
  };
};
