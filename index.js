'use strict';

/**
 * CRUD middlewares to access bookshelf models
 */

module.exports = {
  create: require('./lib/create'),
  destroy: require('./lib/destroy'),
  search: require('./lib/search'),
  find: require('./lib/find'),
  findAll: require('./lib/find-all')
};

