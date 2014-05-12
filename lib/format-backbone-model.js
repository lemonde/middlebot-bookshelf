'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var formatKeys = require('format-keys');

module.exports = function (model) {
  if (! model) return null;
  var data = model.toJSON();
  return formatKeys(data, _s.camelize);
};
