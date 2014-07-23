'use strict';

var _ = require('lodash');
var backboneFormatter = require('../formatters/backbone');

module.exports = function (options) {
  return function (req, res, next) {
    options.model.collection()
    .query('where', options.where(req))
    .fetch()
    .then(function (output) {
      var ids = _.map(backboneFormatter.formatModel(output), function (model) {
        return model[options.key];
      });
      req.where = {id: ids};
    })
    .exec(next);
  };
};

