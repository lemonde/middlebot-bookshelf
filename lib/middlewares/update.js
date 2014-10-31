'use strict';

var snakeCaseKeys = require('../utils/snake-case-keys');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var backboneFormatter = require('../formatters/backbone');
var NewError = require('../errors/');
var inflect = require('i')();

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Update a record in a table.
 *
 * @param {Model} options.model
 * @param {Error} options.error an optional custom error object
 */

module.exports = function (options) {
  return function (req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);

    options.model.forge({id: req.params.id})
    .fetch()
    .then(function (model) {
      if (!model) {

        //default error can be overrided
        if (options.error) throw options.error;

        var resourceName = inflect.titleize(inflect.singularize(options.model.prototype.tableName));
        throw NewError('update:not-found', resourceName);
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
