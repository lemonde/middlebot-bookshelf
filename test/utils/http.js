var http = require('http');
var _ = require('lodash');

/**
 * Expose module.
 */

exports.createServer = createServer;

/**
 * Create a new server.
 *
 * @param {Function} middleware
 * @param {Object} options
 */

function createServer(middleware, options){
  return http.createServer(function (req, res) {
    _.extend(req, options);
    middleware(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = err ? (err.status || 500) : res.statusCode;
      var body = res.metadata ? _.pick(res, 'metadata', 'body') : res.body;
      res.end(err ? err.message : JSON.stringify(body));
    });
  });
}