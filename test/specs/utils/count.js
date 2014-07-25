'use strict';

var expect = require('chai').expect;
var executeCount = require('../../../lib/utils/count');
var db = require('../../fixtures/database');
var knex = db.knex;

describe('count query', function () {
  beforeEach(db.reset);

  it('should count all the items in the query', function (done) {
    var query = knex('authors');
    executeCount(query, function (err, count) {
      if (err) done(err);
      expect(count).to.eql(2);
      done();
    });
  });
});

