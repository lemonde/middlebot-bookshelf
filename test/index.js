'use strict';

var chai = require('chai');
var expect = chai.expect;

var PgDatabase = require('pg-database');
var authorSchema = require('pg-database/lib/schemas/authors');
var bookshelfMiddleware = require('../lib/');

describe('fetch one item in a table', function () {
  var res, req, database, knex;

  beforeEach(function (done) {

    database = new PgDatabase({
      'client': 'sqlite',
      'connection': {
        'filename': ':memory:'
      },
      'pool': {
        'max': 1
      }
    });

    knex = database.bookshelf.knex;
    resetTable(done);

    res = {};
    req = {};
  });

  it('should fetch an author with its id', function (done) {
    req.where = {id: 1};

    bookshelfMiddleware({Model: database.Author})
    .find(null, req, res, function (err) {
      if (err) done(err);
      expect(res.attributes.long_name).to.equal('George Abitbol');
      expect(res.attributes.short_name).to.equal('G.A.');
      done();
    });

  });

  it('should fetch an author its long name', function (done) {
    req.where = {long_name: 'George Abitbol'};

    bookshelfMiddleware({Model: database.Author})
    .find(null, req, res, function (err) {
      if (err) done(err);
      expect(res.attributes.long_name).to.equal('George Abitbol');
      expect(res.attributes.short_name).to.equal('G.A.');
      done();
    });
  });

  function resetTable(done) {
    knex.schema.dropTableIfExists('authors')
    .exec(function () {
      knex.schema.createTable('authors', defineTable)
      .exec(populate.bind(null, done));
    });
  }

  function defineTable(table) {
    table.engine('InnoDB');
    table.timestamps();
    table.charset('utf8');
    authorSchema.build(table);
  }

  function populate(done) {
    database.Author.forge().save({
      long_name: 'George Abitbol',
      short_name: 'G.A.',
      origin: 'L\'homme le plus classe du monde'
    }).exec(done);
  }
});

