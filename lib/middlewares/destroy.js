/**
 * Destroy a record.
 *
 * @param options.model {Model} a Bookshelf Model
 */

module.exports = function (options) {
  return function (req, res, next) {
    options.model.forge({ id: req.params.id }).destroy().exec(next);
  };
};
