'use strict';

var backboneFormatter = require('./formatters/backbone');
var formatFindQuery = require('./format-find-query');

/**
 * Fetch a record from one table.
 *
 * @param options.model {Object} a Bookshelf Model
 */

module.exports = function (options) {
  return function(req, res, next) {
    var query = formatFindQuery(req.query);

    options.model.forge(query.where)
    .fetch(query.options)
    .then(function (model) {
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
