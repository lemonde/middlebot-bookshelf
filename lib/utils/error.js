/**
 * Create a new error.
 *
 * @param {string} message
 * @param {number} statusCode
 * @returns {Error}
 */

module.exports = function (message, statusCode) {
  var error = new Error(message);
  error.statusCode = statusCode || 400;
  return error;
};