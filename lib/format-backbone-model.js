'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var formatKeys = require('format-keys');

module.exports = function (obj) {
  if (!obj) return null;

  return _.compose(
    _.partialRight(formatKeys, _s.camelize),
    function(model) {
      return model.toJSON();
    }
  )(obj);
};
