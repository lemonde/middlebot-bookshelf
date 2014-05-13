var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var whereFormatter = require('../formatters/where');

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
    var where = whereFormatter(OPTIONS_KEYS, req.query);

    options.model.forge(where)
    .fetch(bkOpts)
    .then(function (model) {
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
