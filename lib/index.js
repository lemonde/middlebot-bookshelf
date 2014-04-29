'use strict';

var _ = require('lodash');

/**
 * CRUD middlewares to access bookshelf models
 *
 * @param options.Model {Object} a Bookshelf Model
 * @return {Object} return CRUD middlewares
 */
module.exports = function (options) {

  /**
   * middleware
   *
   * @param err {Any}
   * @param req.where {Object} used to query Model
   * @param req.opts {Object} additional options for
   * Bookshelf's fetch method
   * @param next {function}
   */
  function find(err, req, res, next) {
    var where = req.where;
    var opts = req.opts;

    options.Model.forge(where)
    .fetch(opts).exec(function (err, output) {
      res = _.merge(res, output);
      next(err);
    });
  }

  return {
    find: find
  };
};

