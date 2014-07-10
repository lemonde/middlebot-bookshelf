var util = require('util');
var snakeCaseKeys = require('../utils/snake-case-keys');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var backboneFormatter = require('../formatters/backbone');
var errors = require('../errors/');
var inflect = require('i')();

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Update a record in a table.
 *
 * @param {Model} options.model
 */

module.exports = function (options) {
  return function (req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);

    options.model.forge({id: req.params.id})
    .fetch()
    .then(function (model) {
      if (!model) {
        var resourceName = inflect.titleize(inflect.singularize(options.model.prototype.tableName));
        throw errors('update:not-found', resourceName);
      }
      return model.save(snakeCaseKeys(req.body));
    })
    .then(function (model) {
      return model.load(bkOpts.withRelated);
    })
    .then(function (model) {
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
