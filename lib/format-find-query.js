'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var snakeCaseKeys = require('./utils/snake-case-keys');

module.exports = function (query) {
  // Bookshelf options picked in `req.query`.
  var bookshelfOptions = ['withRelated'];

  // Pick bookshelf options from req.query.
  var options = _.pick(query, bookshelfOptions);

  // Format withRelated.
  if (options.withRelated) {
    if (! _.isArray(options.withRelated)) options.withRelated = [options.withRelated];
    options.withRelated = options.withRelated.map(function (value) {
      return _s.underscored(value);
    });
  }

  // Omit bookshelf options and snakeCaseify where.
  var where = _.omit(query, bookshelfOptions);
  where = snakeCaseKeys(where);

  return {
    options: options,
    where: where
  };
};
