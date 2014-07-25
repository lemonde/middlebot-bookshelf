'use strict';

var _ = require('lodash');

/**
 * count the number of items returned by a query
 *
 * @param {knex} countQuery a copy of the actual
 * query to perform, only used to count
 * @param {function} done called once the count query
 * is done
 */
module.exports = function (countQuery, done) {
  countQuery.aggregates = [];
  countQuery.columns = [];
  countQuery.flags = [];
  countQuery.havings = [];
  countQuery.orders = [];

  countQuery
  .count('*')
  .exec(function (err, res) {
    done(err, res && res[0] && +_.find(res[0]));
  });
};
