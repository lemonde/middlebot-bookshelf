'use strict';

/**
 * find middleware, to get one record from a table
 *
 * @param options.model {Object} a Bookshelf Model
 * @return {function} find middleware
 */
module.exports = function (options) {

  /**
   * @param {Object} req.where used to query Bookshelf.Model
   * @param {Object} req.opts additional options for
   * Bookshelf's fetch method
   * @param {function} next
   */
  return function(req, res, next) {
    var where = req.where;
    var opts = req.options;

    options.model.forge(where)
    .fetch(opts).exec(function (err, output) {
      if (err) return next(err);
      res.body = output;
      next();
    });
  };
};
