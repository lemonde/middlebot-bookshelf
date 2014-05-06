'use strict';

/**
 * destroy middleware, to destroy a record
 *
 * @param options.model {Object} a Bookshelf Model
 * @return {function} create middleware
 */
module.exports = function (options) {
  return function(err, req, res, next) {
    options.model.forge({id: req.id}).destroy().exec(function(err, data) {
      if(err) return next(err);
      res.body = data;
      next();
    });
  };
};
