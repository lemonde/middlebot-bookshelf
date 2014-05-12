'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var formatKeys = require('format-keys');

module.exports = function (collection) {
  if (! collection) return null;
  var data = collection.map(function (model) {
    return model.toJSON();
  });
  return formatKeys(data, _s.camelize);
};
