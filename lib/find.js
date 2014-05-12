'use strict';

var formatBackboneModel = require('./format-backbone-model');
var formatFindOptions = require('./format-find-options');
var snakeCaseKeys = require('./snake-case-keys');

/**
 * find middleware, to get one record from a table
 *
 * @param options.model {Object} a Bookshelf Model
 * @return {function} find middleware
 */
module.exports = function (options) {

  /**
   * @param {Object} req.where used to query Bookshelf.Model
   * @param {Object} req.options additional options for
   * Bookshelf's fetch method
   * @param {function} next
   */
  return function(req, res, next) {

    formatFindOptions(req);
    req.where = snakeCaseKeys(req.where);

    options.model.forge(req.where)
    .fetch(req.options).exec(function (err, output) {
      if (err) return next(err);
      res.body = formatBackboneModel(output);
      next();
    });
  };
};
