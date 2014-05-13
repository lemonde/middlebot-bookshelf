'use strict';

var snakeCaseKeys = require('../utils/snake-case-keys');
var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Create a record.
 *
 * @param options.model {Object} a Bookshelf Model
 * @return {function} middleware
 */

module.exports = function (options) {
  return function (req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);
    var body = snakeCaseKeys(req.body);

    options.model.forge()
    .save(body)
    .then(function (model) {
      return model.load(bkOpts.withRelated);
    })
    .then(function (model) {
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
