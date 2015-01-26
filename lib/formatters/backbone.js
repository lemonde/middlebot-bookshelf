'use strict';

/**
 * Format a Backbone model to a plain objects.
 */

exports.formatModel = function (model) {
  if (! model) return null;
  return model.toJSON();
};

/**
 * Format a Backbone collection into an array of plain objects.
 */

exports.formatCollection = function (collection) {
  if (! collection) return null;
  return collection.map(function (model) {
    return model.toJSON();
  });
};
