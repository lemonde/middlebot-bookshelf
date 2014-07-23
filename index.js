'use strict';

var _ = require('lodash');

/**
 * Expose module.
 */

exports.create = require('./lib/middlewares/create');
exports.update = require('./lib/middlewares/update');
exports.destroy = require('./lib/middlewares/destroy');
exports.find = require('./lib/middlewares/find');
exports.findAll = require('./lib/middlewares/find-all');
exports.checkExist = _.partialRight(require('./lib/middlewares/check-exist'), true);
exports.checkNotExist = _.partialRight(require('./lib/middlewares/check-exist'), false);
exports.where = require('./lib/middlewares/where');
