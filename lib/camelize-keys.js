'use strict';

var _ = require('lodash');
var _s = require('underscore.string');

var utils = require('./utils');

module.exports = function () {
  return function (err, req, res, next) {
    req.where = _.partial(utils.deepFormatKeys, _s.camelize)(req.where);
    next(err);
  };
};