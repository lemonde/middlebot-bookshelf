'use strict';

/**
 * find middleware, to get one record from a table
 *
 * @param options.model {Object} a Bookshelf Model
 * @return {function} find middleware
 */
module.exports = function (options) {

  /**
   * @param {Any} err
   * @param {Object} req.where used to query Bookshelf.Model
   * @param {Object} req.opts additional options for
   * Bookshelf's fetch method
   * @param {function} next
   */
  return function(err, req, res, next) {
    var where = req.where;
    var opts = req.opts;

    options.model.forge(where)
    .fetch(opts).exec(function (err, output) {
      res.body = output;
      next(err);
    });
  };
};
