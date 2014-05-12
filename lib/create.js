'use strict';

var snakeCaseKeys = require('./snake-case-keys');
var formatBackboneModel = require('./format-backbone-model');

/**
 * create middleware, to create a record
 *
 * @param options.model {Object} a Bookshelf Model
 * @return {function} create middleware
 */
module.exports = function (options) {
  return function (req, res, next) {
    var body = snakeCaseKeys(req.body);
    options.model
    .forge()
    .save(body)
    .then(function (model) {
      res.body = formatBackboneModel(model);
    })
    .exec(next);
  };
};
