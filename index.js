'use strict';

var _ = require('lodash');

/**
 * Expose module.
 */

exports.create = require('./lib/create');
exports.update = require('./lib/update');
exports.destroy = require('./lib/destroy');
exports.search = require('./lib/search');
exports.find = require('./lib/find');
exports.findAll = require('./lib/find-all');
exports.checkExist = require('./lib/check-exist');
exports.checkNotExist = _.partialRight(require('./lib/check-exist'), true);
