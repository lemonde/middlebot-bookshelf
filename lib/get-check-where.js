
'use strict';

var _ = require('lodash');

/**
 * Return a where object to use for
 * check-exist and check-not-exist middleware
 */
module.exports = function (keys, req, res) {
    if (_.isFunction(keys)) {
      return keys(req, res);
    }

    if (_.isArray(keys)) {
      return _.reduce(keys, function (result, value) {
        result[value] = req.body[value];
        return result;
      }, {});
    }

    //else keys is a string
    var where = {};
    where[keys] = req.body[keys];
    return where;
};
