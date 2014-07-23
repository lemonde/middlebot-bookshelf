'use strict';

var _ = require('lodash');
var backboneFormatter = require('../formatters/backbone');
var NewError = require('../errors/');

/**
 * Set the req.query.id object necessary for when using an
 * association table.
 * For example, if the client wants to retrieve
 * all authors of an article, he can use this middleware to
 * find all the ids of the authors of a given article
 *
 * @param {Model} options.model the model of the association table
 *
 * @param {object|function} options.where used as the "where" when
 * querying the association table. if it is a function, use its return
 * value.
 * For example, to get all the articles matching the id param a request
 * in the article-authors table, use: {article_id: req.params.id}
 *
 * @param {string} options.key the key to extract to extract from each
 * fetched association table row
 * For example to get all the ids of the authors of an article from the
 * article-authors table, use 'authorId'
 *
 * @param {integer|function} options.index an optional zero based index or a function
 * returning the index of which item to return among all the found one
 */
module.exports = function (options) {
  return function (req, res, next) {
    options.model.collection()
    .query('where', _.isFunction(options.where) ? options.where(req) : options.where)
    .fetch()
    .then(function (output) {
      var ids = _.map(backboneFormatter.formatModel(output), function (model) {
        return model[options.key];
      });
      req.query.id = ids;
      if (options.index) {
        var index = _.isFunction(options.index) ? options.index(req) : options.index;
        if (!ids[index]) throw NewError('where:missing-index', index);

        req.query.id = ids[index];
      }
    })
    .exec(next);
  };
};

