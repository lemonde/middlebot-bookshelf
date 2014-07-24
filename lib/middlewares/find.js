var util = require('util');
var inflect = require('i')();
var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var NewError = require('../errors/');

// Bookshelf options keys.
var OPTIONS_KEYS = ['withRelated'];

/**
 * Fetch a record from one table.
 *
 * @param {object} options.model a Bookshelf Model
 * @param {Error} options.error an optional custom error object
 * @param {function} options.filter an optional function to filter
 * the body results. The function takes res.body as argument and
 * its return value is affected to res.body
 */

module.exports = function (options) {
  return function(req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);

    options.model.forge({ id: req.params.id })
    .fetch(bkOpts)
    .then(function (model) {
      if (! model) {

        //default error can be overrided
        if (options.error) throw options.error;

        var resourceName = inflect.titleize(inflect.singularize(options.model.prototype.tableName));
        throw NewError('find:not-found', resourceName);
      }
      res.body = backboneFormatter.formatModel(model);

      //optional custom filtering of result
      if (options.filter) res.body = options.filter(res.body);
    })
    .exec(next);
  };
};
