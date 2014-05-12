'use strict';

var checkExist = require('./check-exist');

var snakeCaseKeys = require('./utils/snake-case-keys');
var formatBackboneModel = require('./format-backbone-model');

/**
 * update middleware
 *
 * @param {Model} options.model
 * @param {error} options.error
 */
module.exports = function (options) {
  return function (req, res, next) {
    options.model.forge({id: req.query.id})
    .fetch()
    .then(function (result) {
      if (!result) throw options.error;
      return result.save(snakeCaseKeys(req.body));
    })
    .then(function (result) {
      res.body = formatBackboneModel(result);
    })
    .exec(next);
  };
};
