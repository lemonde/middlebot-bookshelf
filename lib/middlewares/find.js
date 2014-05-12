var _ = require('lodash');
var _s = require('underscore.string');
var backboneFormatter = require('../formatters/backbone');
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
    // Format bookshelf options.
    var bkOpts = _.defaults(
      _.pick(options, OPTIONS_KEYS),
      _.pick(req.query, OPTIONS_KEYS)
    );

    // Format withRelated.
    if (bkOpts.withRelated) {
      if (! _.isArray(bkOpts.withRelated)) bkOpts.withRelated = [bkOpts.withRelated];
      bkOpts.withRelated = bkOpts.withRelated.map(function (value) {
        return _s.underscored(value);
      });
    }

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
