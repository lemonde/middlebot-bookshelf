'use strict';

var _ = require('lodash');

module.exports = function () {
  return function (err, req, res, next) {
    req.options = req.options || {};

    // Param names.
    req.paramNames = ['sortBy', 'sortDirection', 'limit', 'offset', 'count'];

    // Default param values.
    req.options = _.defaults(req.options, {
      sortBy: 'id',
      sortDirection: 'desc',
      limit: 20,
      offset: 0
    });

    req.params = _.pick(req.options, req.paramNames);

    if (_.isFunction(req.where)) {
      return next();
    }
    else {
      // Default to empty object.
      req.where = req.where || {};

      // Pick withRelated from where object.
      req.opts = _.extend({}, req.options, _.pick(req.where, 'withRelated'));

      // Remove withRelated from where.
      req.where = _.omit(req.where, 'withRelated');

      // Pick parameters from where object.
      _.extend(req.params, _.pick(req.where, req.paramNames));

      // Remove param from where.
      req.where = _.omit(req.where, req.paramNames);

      // Pick Array value for whereIn request
      req.whereIn = _.pick(req.where, function (value) {
        return _.isArray(value);
      });

      // Remove Array from where value.
      req.where = _.omit(req.where, function (value) {
        return _.isArray(value);
      });
    }

    next();
  };
};