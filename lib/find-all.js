'use strict';

var _ = require('lodash');

/**
 * findAll middleware, to get multiple records from
 * a table
 *
 * @param options.collection {Object} a Bookshelf Collection
 * @return {function} findAll middleware
 */
module.exports = function (options) {

  /**
   * @param {Any} err
   * @param {Object} req.where used to query Bookshelf.Model
   * @param {Integer} req.params.offset pagination offset
   * @param {Integer} req.params.limit pagination limit
   * @param {string} req.params.sortBy
   * @param {string} req.params.sortDirection
   * @param {Boolean} req.params.count wether to return result count in
   * metadata
   */
  return function (err, req, res, next) {

    var paramNames = ['sortBy', 'sortDirection', 'limit', 'offset', 'count'];
    var collection = options.collection ? collection.collection.forge() : options.model.collection();
    var where = req.where;
    var opts = req.options;
    var whereIn = req.options.whereIn;

    if (_.isFunction(where)) {
      collection = collection.query(where);
    }
    else {

      // Execute query with where object.
      collection.query('where', _.omit(where, paramNames));

      var emptyWhereIn = _.some(whereIn, function (val) {
        return ! val.length;
      });

      // If a whereIn is empty, we return no results.
      if (emptyWhereIn) return next();

      _.forIn(whereIn, function (val, key) {
        collection.query('whereIn', key, val);
      });
    }

    var countQuery = collection.query().clone();

    collection
    .query('offset', opts.offset)
    .query('limit', opts.limit)
    .query('orderBy', opts.sortBy, opts.sortDirection)
    .fetch(opts)
    .exec(function (err, output) {
      if (err) return next(err);

      res.body = output;

      // Set metadata on output.
      res.metadata = {
        offset: opts.offset,
        limit: opts.limit,
        count: null
      };

      // If count is not asked, return null as count.
      if (! opts.count) return next(err);

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
