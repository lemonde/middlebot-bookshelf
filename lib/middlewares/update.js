var snakeCaseKeys = require('../utils/snake-case-keys');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var backboneFormatter = require('../formatters/backbone');

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Update a record in a table.
 *
 * @param {Model} options.model
 * @param {Error} options.error
 */

module.exports = function (options) {
  return function (req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);

    options.model.forge({id: req.query.id})
    .fetch()
    .then(function (model) {
      if (!model) throw options.error;
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
