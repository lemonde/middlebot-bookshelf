'use strict';

var _ = require('lodash');
var inflect = require('i')();

var backboneFormatter = require('../formatters/backbone');
var bkOptionsFormatter = require('../formatters/bookshelf-options');
var whereFormatter = require('../formatters/where');
var executeCount = require('../utils/count');
var NewError = require('../errors/');

// Bookshelf options keys.
var OPTIONS_KEYS = ['sortBy', 'sortDirection', 'limit', 'offset', 'count', 'withRelated'];

/**
 * Fetch a related resource from a primary resource
 *
 * @param {Model} options.model the primary resource containing the related resource
 * @param {string} options.related the name of the related resource to fetch
 */
module.exports = function (options) {
  return function (req, res, next) {
    var bkOpts = bkOptionsFormatter(OPTIONS_KEYS, req.query, options, {
      sortBy: 'id',
      sortDirection: 'desc',
      limit: 20,
      offset: 0
    });

    var where = whereFormatter(_.union(OPTIONS_KEYS, options.omit), req.query);

    // Pick array values from where.
    var whereIn = _.pick(where, _.isArray);
    where = _.omit(where, _.isArray);

    var countQuery;
    var query = {};
    query[options.related] = buildQuery;

    //fetch the primary resource along with the related resource we want
    options.model.forge({id: req.params.id})

    //the related resource is fetched with a custom build query allowing
    //to use filters (where, pagination...) even for the related resource
    .fetch({withRelated: [options.related, query]})
    .exec(function (err, output) {
      if (! output) {
        var resourceName = inflect.titleize(inflect.singularize(options.model.prototype.tableName));
        return next(NewError('find:not-found', resourceName));
      }

      //store the related resource as the response body
      res.body = backboneFormatter.formatModel(output);
      res.body = res.body[options.related];

      //optionally, only a single related resource might be requested
      if (req.params.relatedIndex) res.body = res.body[--req.params.relatedIndex];

      // Set metadata on output.
      res.metadata = {
        offset: bkOpts.offset,
        limit: bkOpts.limit,
        count: null
      };

      // If count is not asked, return null as count.
      if (! bkOpts.count) return next(err);

      // Else fetch count then return it.
      executeCount(countQuery, function (err, count) {
        if (err) return next(err);
        res.metadata.count = count;
        next();
      });
    });

    /**
     * build the query to fetch the related resource correctly
     * (with where, pagination...)
     */
    function buildQuery(qb) {
      _.forIn(whereIn, function (val, key) {
        //use the fully qualified name of the the property else
        //some sql query fail because of ambiguous names (mainly
        //for 'id' properties)
        qb.whereIn(options.related + '.' + key, val);
      });
      countQuery = qb.clone();
      qb.where(where)
        .limit(bkOpts.limit)
        .offset(bkOpts.offset)
        .orderBy(bkOpts.sortBy, bkOpts.sortDirection);
    }
  };
};


