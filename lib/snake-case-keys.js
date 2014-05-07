'use strict';

var _ = require('lodash');
var _s = require('underscore.string');

var utils = require('./utils');

/**
 * convert all keys to snake case
 *
 * @param {string} options.key the key to snake case
 */
module.exports = function (options) {
  return function (req, res, next) {
    req[options.key] = _.partial(utils.deepFormatKeys, _s.underscored)(req.where);
    next();
  };
};
