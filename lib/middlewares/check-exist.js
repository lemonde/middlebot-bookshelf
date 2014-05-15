var _ = require('lodash');
var _s = require('underscore.string');
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
    var where;

    // Where as function.
    if (_.isFunction(options.where)) where = options.where(req, res);

    // Where as array or string.
    else {
      // Convert string to array.
      if (! _.isArray(options.where)) options.where = [options.where];

      // Snake-case-ify body.
      var body = snakeCaseKeys(req.body || {});

      // Pick where including undefined values.
      where = options.where.reduce(function (where, value) {
        value = _s.underscored(value);
        where[value] = body[value];
        return where;
      }, {});
    }

    // If we are in strict mode and if a property is missing, stop here.
    if (options.strict) {
      // Check if a property is missing.
      var missingProperty = _.any(where, function (value) {
        return _.isUndefined(value) || _.isNull(value);
      });

      if (missingProperty) return next(options.error);
    }

    options.model.forge(where).fetch().exec(function (err, result) {
      if (err) return next(err);
      var exists = !!result;
      if (exists !== mustExists) return next(options.error);
      next();
    });
  };
};