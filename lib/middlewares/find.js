'use strict';

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
 * @param {string} options.target the attribute to use as "id"
 */

module.exports = function (options) {
  return function(req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options);

    var findObj = {};
    findObj[options.target || 'id'] = req.params.id;

    options.model
    .where(findObj)
    .fetch(bkOpts)
    .then(function (model) {
      if (! model) {

        //default error can be overrided
        if (options.error) throw options.error;

        var resourceName = inflect.titleize(inflect.singularize(options.model.prototype.tableName));
        throw NewError('find:not-found', resourceName);
      }
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
