'use strict';

var _ = require('lodash');

var getWhere = require('./get-check-where');

/**
 * checkExist/checkNotExist middleware.
 * Makes sure that a row exists/dont exists and throw
 * an error if needed
 *
 * @param {Model} options.model
 * @param {string | string[] | function} options.keys If a string or
 * an array of string is provided, use req.body to find key.
 * The function have req and res as arguments and must return a where expression.
 * @param {Error} options.error
 * @param notExists flag determining wether to use checkExist (true) or checkNotExist (false)
 */
module.exports = function (options, notExists) {
  return function (req, res, next) {
    options.model.forge(getWhere(options.keys, req, res)).fetch().exec(function (err, result) {
      if (err) return next(err);
      if (!!result === !!notExists) return next(options.error);
      next();
    });
  };
};
