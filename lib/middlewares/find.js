var util = require('util');
var inflect = require('i')();
var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var errors = require('../errors/');

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Fetch a record from one table.
 *
 * @param options.model {Object} a Bookshelf Model
 */

module.exports = function (options) {
  return function(req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);

    options.model.forge({ id: req.params.id })
    .fetch(bkOpts)
    .then(function (model) {
      if (! model) {
        var resourceName = inflect.titleize(inflect.singularize(options.model.prototype.tableName));
        throw errors('find:not-found', resourceName);
      }
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
