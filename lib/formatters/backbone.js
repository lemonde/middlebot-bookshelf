var _s = require('underscore.string');
var formatKeys = require('format-keys');

/**
 * Format a Backbone model to a plain objects.
 */

exports.formatModel = function (model) {
  if (! model) return null;
  var data = model.toJSON();
  return formatKeys(data, _s.camelize);
};

/**
 * Format a Backbone collection into an array of plain objects.
 */

exports.formatCollection = function (collection) {
  if (! collection) return null;
  var data = collection.map(function (model) {
    return model.toJSON();
  });
  return formatKeys(data, _s.camelize);
};