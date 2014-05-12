
'use strict';

var _ = require('lodash');

/**
 * Return a where object to use for
 * check-exist and check-not-exist middleware
 */
module.exports = function (where, req, res) {
  if (_.isFunction(where)) return where(req, res);
  return _.pick(req.body, where);
};
