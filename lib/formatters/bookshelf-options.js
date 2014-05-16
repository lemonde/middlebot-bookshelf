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

  // Format sortBy.
  if (bkOpts.sortBy) bkOpts.sortBy = _s.underscored(bkOpts.sortBy);

  // Format limit.
  if (bkOpts.limit) bkOpts.limit = parseInt(bkOpts.limit, 10);

  // Format offset.
  if (bkOpts.offset) bkOpts.offset = parseInt(bkOpts.offset, 10);

  return bkOpts;
};
