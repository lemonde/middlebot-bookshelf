'use strict';

var snakeCaseKeys = require('./utils/snake-case-keys');
var backboneFormatter = require('./formatters/backbone');

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
      res.body = backboneFormatter.formatModel(model);
    })
    .exec(next);
  };
};
