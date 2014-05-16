/**
 * Create a new error.
 *
 * @param {string} message
 * @param {number} status
 * @returns {Error}
 */

module.exports = function (message, status) {
  var error = new Error(message);
  error.status = status || 400;
  return error;
};