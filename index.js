'use strict';

/**
 * CRUD middlewares to access bookshelf models
 */

module.exports = {
  create: require('./lib/create'),
  destroy: require('./lib/destroy'),
  search: require('./lib/search'),
  find: require('./lib/find'),
  findAll: require('./lib/find-all'),
  snakeCaseKeys: require('./lib/snake-case-keys'),
  camelizeKeys: require('./lib/camelize-keys'),
  formatFindOptions: require('./lib/format-find-options'),
  formatFindAllOptions: require('./lib/format-find-all-options'),
  formatBackboneModel: require('./lib/format-backbone-model'),
  formatBackboneCollection: require('./lib/format-backbone-collection')
};

