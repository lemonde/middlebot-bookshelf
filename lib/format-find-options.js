'use strict';

var _ = require('lodash');

module.exports = function () {
  return function (err, req, res, next) {
    req.options = req.options || {};

    req.where = _.isObject(req.where) ? req.where : { id: req.where };

    // Pick withRelated from where object.
    req.options = _.extend({}, req.options, _.pick(req.where, 'withRelated'));

    // Remove withRelated from where.
    req.where = _.omit(req.where, 'withRelated');

    next();
  };
};
