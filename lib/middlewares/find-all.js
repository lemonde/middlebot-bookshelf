'use strict';

var _ = require('lodash');

var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var whereFormatter = require('../formatters/where');

// Bookshelf options keys.
var OPTIONS_KEYS = ['sortBy', 'sortDirection', 'limit', 'offset', 'count', 'withRelated'];

/**
 * Get multiple records from a table.
 *
 * @param options.collection {Collection} a Bookshelf Collection
 * @return {function} findAll middleware
 */

module.exports = function (options) {

  /**
   * @param {Object} req.where used to query Bookshelf.Model
   * @param {Integer} req.params.offset pagination offset
   * @param {Integer} req.params.limit pagination limit
   * @param {string} req.params.sortBy
   * @param {string} req.params.sortDirection
   * @param {Boolean} req.params.count wether to return result count in
   * metadata
   */
  return function (req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options, {
      sortBy: 'id',
      sortDirection: 'desc',
      limit: 20,
      offset: 0
    });
    var where = whereFormatter(OPTIONS_KEYS, req.query);
    var collection = options.collection ? collection.collection.forge() : options.model.collection();

    // Pick array values from where.
    var whereIn = _.pick(where, isArrayFilter);
    where = _.omit(where, isArrayFilter);

    function isArrayFilter(value) {
      return _.isArray(value);
    }

    collection.query('where', where);

    _.forIn(whereIn, function (val, key) {
      collection.query('whereIn', key, val);
    });

    var countQuery = collection.query().clone();

    collection
    .query('offset', bkOpts.offset)
    .query('limit', bkOpts.limit)
    .query('orderBy', bkOpts.sortBy, bkOpts.sortDirection)
    .fetch(bkOpts)
    .exec(function (err, output) {
      if (err) return next(err);

      res.body = backboneFormatter.formatCollection(output);

      // Set metadata on output.
      res.metadata = {
        offset: bkOpts.offset,
        limit: bkOpts.limit,
        count: null
      };

      // If count is not asked, return null as count.
      if (! bkOpts.count) return next(err);

      // Else fetch count then return it.
      executeCount(function (err, count) {
        if (err) return next(err);
        res.metadata.count = count;
        next();
      });
    });

    function executeCount(callback) {
      countQuery.aggregates = [];
      countQuery.columns = [];
      countQuery.flags = [];
      countQuery.havings = [];
      countQuery.orders = [];

      countQuery
      .count('*')
      .exec(function (err, res) {
        callback(err, res && res[0] && +_.find(res[0]));
      });
    }
  };
};