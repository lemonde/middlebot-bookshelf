var _ = require('lodash');
var _s = require('underscore.string');
var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var snakeCaseKeys = require('../utils/snake-case-keys');

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Fetch a record from one table.
 *
 * @param options.model {Object} a Bookshelf Model
 */

module.exports = function (options) {
  return function(req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query,options);

    // Format the where.
    var where = _.omit(req.query, OPTIONS_KEYS);
    where = snakeCaseKeys(where);

    options.model.forge(where)
    .fetch(bkOpts)
    .then(function (model) {
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
