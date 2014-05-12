'use strict';

var checkExist = require('./check-exist');

var snakeCaseKeys = require('./snake-case-keys');
var formatBackboneModel = require('./format-backbone-model');

/**
 * update middleware
 *
 * @param {Model} options.model
 * @param {error} options.error
 */
module.exports = function (options) {
  return function (req, res, next) {
    //get model to update
    options.model.forge({id: req.query.id})
    .fetch()
    .exec(function (err, result) {
      if (err) return next(err);
      if (!result) return next(options.error);

      //update
      result
      .save(snakeCaseKeys(req.body))
      .exec(function (err, result) {
        if (err) return next(options.error);
        res.body = formatBackboneModel(result);
        next();
      });
    });
  };
};
