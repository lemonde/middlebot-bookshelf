/**
 * Destroy a record.
 *
 * @param options.model {Model} a Bookshelf Model
 */

module.exports = function (options) {
  return function (req, res, next) {
    // Set status to "204 No Content".
    res.statusCode = 204;

    options.model.forge({ id: req.params.id }).destroy().exec(next);
  };
};
