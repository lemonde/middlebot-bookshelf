'use strict';

var _ = require('lodash');
var _s = require('underscore.string');

var utils = require('./utils');

module.exports = function () {
  return function (req, res, next) {
    req.where = _.partial(utils.deepFormatKeys, _s.underscored)(req.where);
    next();
  };
};
