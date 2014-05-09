'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var formatKeys = require('format-keys');

module.exports = function () {
  return function (req, res, next) {
    if (!res.body) return next();

    res.body = _.compose(
      _.partialRight(formatKeys, _s.camelize),
      function(collection) {
        return collection.map(function (model) {
          return model.toJSON();
        });
      }
    )(res.body);
    next();
  };
};
