'use strict';

var _ = require('lodash');

module.exports = function (req) {
  req.options = req.options || {};

  req.where = _.isObject(req.query) ? req.query : { id: req.query };

  // Pick withRelated from where object.
  req.options = _.extend({}, req.options, _.pick(req.where, 'withRelated'));

  // Remove withRelated from where.
  req.where = _.omit(req.where, 'withRelated');
};
