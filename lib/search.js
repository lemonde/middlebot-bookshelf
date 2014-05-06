'use strict';

var _ = require('lodash');

/**
 * Search middleware, return the records matching
 * the search pattern
 *
 * @param {function} options.index.search
 * @return {function} search middleware
 */
module.exports = function (options) {

  /**
   * @param {Any} err
   * @param {string} req.where.search.q search query
   * @param {Object} req.where.search search params
   * @param {Integer} req.where.limit used as search param 'row'
   * @param {Integer} req.where.offset used as seach param 'offset'
   * @param {function} next
   */
  return function (err, req, res, next) {
    var searchParams = _.omit(req.where.search, 'q');

    // Map limit and offset on search parameters.
    if (! _.isUndefined(req.where.limit)) searchParams.rows = req.where.limit;
    if (! _.isUndefined(req.where.offset)) searchParams.start = req.where.offset;

    options.index.search(req.where.search.q, searchParams, function (err, result) {
      if (err) return next(err);

      //store ids to fetch on a following find/findAll
      req.where = _.extend({
        id: _.pluck(result.documents, 'id')
      }, _.omit(req.where, 'search'));
      next();
    });
  };
};
