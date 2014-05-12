
'use strict';

var _ = require('lodash');

var snakeCaseKeys = require('./snake-case-keys');

/**
 * Return a where object to use for
 * check-exist and check-not-exist middleware
 */
module.exports = function (where, req, res) {
  if (_.isFunction(where)) return where(req, res);
  return _.pick(snakeCaseKeys(req.body), snakeCaseKeys(where));
};
