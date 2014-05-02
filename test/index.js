'use strict';

var chai = require('chai');
var expect = chai.expect;

var PgDatabase = require('pg-database');
var authorSchema = require('pg-database/lib/schemas/authors');
var bookshelfMiddleware = require('../lib/');

describe('CRUD methods on ORM objects', function () {
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

    bookshelfMiddleware.find({model: database.Author})
    (null, req, res, function (err) {
      if (err) done(err);
      expect(res.body.attributes.long_name).to.equal('George Abitbol');
      expect(res.body.attributes.short_name).to.equal('G.A.');
      done();
    });

  });

  it('should fetch an author its long name', function (done) {
    req.where = {long_name: 'George Abitbol'};

    bookshelfMiddleware.find({model: database.Author})
    (null, req, res, function (err) {
      if (err) done(err);
      expect(res.body.attributes.long_name).to.equal('George Abitbol');
      expect(res.body.attributes.short_name).to.equal('G.A.');
      done();
    });
  });

  it('should fetch all authors', function (done) {
    req.params = {
      sortBy: 'id',
      sortDirection: 'desc',
      limit: 20,
      offset: 0,
    };

    bookshelfMiddleware.findAll({model: database.Author})
    (null, req, res, function (err) {
      if (err) return done(err);
      expect(res.body.length).to.equal(2);
      expect(res.body.metadata.limit).to.equal(20);
      expect(res.body.metadata.offset).to.equal(0);
      expect(res.body.metadata.count).to.not.exist;
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
    }).exec(function () {
      database.Author.forge().save({
        long_name: 'George Abitbol2',
        short_name: 'G.A.2',
        origin: 'L\'homme le plus classe du monde2'
      }).exec(done);
    });
  }
});

