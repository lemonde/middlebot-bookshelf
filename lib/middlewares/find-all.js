'use strict';

var _ = require('lodash');

var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var whereFormatter = require('../formatters/where');
var whereRawFormatter = require('../formatters/where-raw');
var executeCount = require('../utils/count');

// Bookshelf options keys.
var OPTIONS_KEYS = ['sortBy', 'sortDirection', 'limit', 'offset', 'count', 'withRelated'];

/**
* Get multiple records from a table.
*
* @param options.collection {Collection} a Bookshelf Collection
* @param options.omit {String[]} a list of req.query parameters to omit
* @param options.json {String[]} a list of req.query parameters to use for json
* from bookshelf's 'where' object
* @return {function} findAll middleware
*/

module.exports = function (options) {
  options.omit = options.omit || [];
  options.json = options.json || [];

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

    var where = whereFormatter(_.union(OPTIONS_KEYS, options.omit), req.query, options.json);
    var whereRaw = whereRawFormatter(_.union(OPTIONS_KEYS, options.omit), req.query, options.json);
    var collection = options.collection ? collection.collection.forge() : options.model.collection();

    // Pick array values from where.
    var whereIn = _.pick(where, isArrayFilter);

    // Remove array values from where.
    where = _.omit(where, isArrayFilter);

    function isArrayFilter(value) {
      return _.isArray(value);
    }

    collection.query('where', where);

    if (whereRaw) {
      collection.query('whereRaw', whereRaw);
    }

    var emptyWhereIn = _.some(whereIn, function (val) {
      return !val.length;
    });

    // If a whereIn is empty, we return no results.
    if (emptyWhereIn) {
      res.body = [];
      return next();
    }

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
      if (!bkOpts.count) return next(err);

      // Else fetch count then return it.
      executeCount(countQuery, function (err, count) {
        if (err) return next(err);
        res.metadata.count = count;
        next();
      });
    });
  };
};
