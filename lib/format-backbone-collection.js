'use strict';

var _ = require('lodash');
var _s = require('underscore.string');

var utils = require('./utils');

module.exports = function () {
  return function (err, req, res, next) {
    res.body = _.compose(
      _.partial(utils.deepFormatKeys, _s.camelize),
      function(collection) {
        return collection.map(function (model) {
          return model.toJSON();
        });
      }
    )(res.body);
    next();
  };
};
