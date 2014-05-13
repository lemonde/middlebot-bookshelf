var _ = require('lodash');

var snakeCaseKeys = require('../utils/snake-case-keys');

/**
 * checkExist/checkNotExist middleware.
 * Makes sure that a row exists/dont exists and throw
 * an error if needed
 *
 * @param {Model} options.model
 * @param {string | string[] | function} options.where If a string or
 * an array of string is provided, use req.body to find key.
 * The function have req and res as arguments and must return a where expression.
 * @param {Error} options.error
 * @param {boolean} options.strict if strict is true, return an error if some of where keys
 * are falsey.
 * @param mustExists flag determining wether to use checkExist (true) or checkNotExist (false)
 */

module.exports = function (options, mustExists) {
  options = _.defaults(options, {
    strict: true
  });

  return function (req, res, next) {
    var where = _.isFunction(options.where) ?
    options.where(req, res) :
    _.pick(req.body, options.where);
    where = snakeCaseKeys(where);

    var emptyWhere = _.every(where, _.isUndefined);
    if (emptyWhere) return next(options.strict ? options.error : null);

    options.model.forge(where).fetch().exec(function (err, result) {
      if (err) return next(err);
      var exists = !!result;
      if (exists !== mustExists) return next(options.error);
      next();
    });
  };
};