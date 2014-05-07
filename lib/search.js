'use strict';

var _ = require('lodash');

/**
 * Search middleware, return the records matching
 * the search pattern
 *
 * @param {function} options.search
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
    var searchParams = _.omit(req.query, 'q');

    // Map limit and offset on search parameters.
    if (! _.isUndefined(req.query.limit)) searchParams.rows = req.query.limit;
    if (! _.isUndefined(req.query.offset)) searchParams.start = req.query.offset;

    options.search(req.query.q, searchParams, function (err, result) {
      if (err) return next(err);

      //store ids to fetch on a following find/findAll
      req.where = _.extend({
        id: _.pluck(result.documents, 'id')
      }, _.omit(req.where, 'search'));
      next();
    });
  };
};
