var _ = require('lodash');
var _s = require('underscore.string');

/**
 * Format bookshelf options.
 *
 * @param {string[]|string} keys
 * @param {...Object} objects
 */

module.exports = function (keys) {
  var objects = _.rest(arguments);
  var bkOpts = {};

  _.each(objects, function (object) {
    _.defaults(bkOpts, object);
  });

  bkOpts = _.pick(bkOpts, keys);

  // Format withRelated.
  if (bkOpts.withRelated) {
    if (! _.isArray(bkOpts.withRelated)) bkOpts.withRelated = [bkOpts.withRelated];
    bkOpts.withRelated = bkOpts.withRelated.map(function (value) {
      return _s.underscored(value);
    });
  }

  // Format sortBy.
  if (bkOpts.sortBy) bkOpts.sortBy = _s.underscored(bkOpts.sortBy);

  return bkOpts;
};