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

  describe('#find', function() {
    it('should be possible to find an object by id', function (done) {
      req.where = {id: 1};

      bookshelfMiddleware.find({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.attributes.long_name).to.equal('George Abitbol');
        expect(res.body.attributes.short_name).to.equal('G.A.');
        done();
      });
    });

    it('should return null when an object is not found', function (done) {
      req.where = {id: 10};

      bookshelfMiddleware.find({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.be.null;
        done();
      });
    });

    it('should be possible to add withRelated option in where', function (done) {
      req.where = {id: 1};
      req.opts = {withRelated: 'user'};

      bookshelfMiddleware.find({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
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
  });

  describe('#findAll', function() {
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

    it('should be possible to find objects by function', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      req.where = function (qb) {
        qb.where({id: 1});
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.length(1);
        expect(res.body.models[0]).to.have.property('id', 1);
        done();
      });
    });

    it('should be possible to add a withRelated in where', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      req.where = {id: 1, withRelated: 'user'};

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.length(0);
        done();
      });
    });

    it('should be possible to set a limit', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 1,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        done();
      });
    });

    it('should be possible to set an offset', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 10,
        offset: 1,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        expect(res.body.models[0]).to.have.property('id', 1);
        done();
      });
    });

    it('should be possible to set a sortBy', function (done) {
      req.params = {
        sortBy: 'shortName',
        sortDirection: 'ASC',
        limit: 10,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.models[0]).to.have.property('id', 1);
        done();
      });
    });

    it('should be possible to set a sortDirection', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'DESC',
        limit: 10,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.models[0]).to.have.property('id', 2);
        done();
      });
    });

    it('should be possible to find multiple values', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      req.whereIn = {id: [1, 2]};

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(2);
        done();
      });
    });

    it('should be possible to count', function (done) {
      req.params = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
        count: true
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body.metadata).to.eql({
          offset: 0,
          limit: 20,
          count: 2
        });
        done();
      });
    });
  });

  describe('#create', function() {
    it('should create an author', function (done) {
      req.data = {
        long_name: 'Georges Abitbol',
        short_name: 'G.A.'
      };
      bookshelfMiddleware.create({model: database.Author})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.exists;
        expect(res.body.attributes.long_name).to.equal('Georges Abitbol');
        done();
      });
    });
  });

  describe('#destroy', function() {
    it('should destroy an author', function (done) {
      req.id = 0;
      bookshelfMiddleware.destroy({model: database.Author})
      (null, req, res, function (err) {
        if(err) return done(err);
        expect(res.body).to.exists;
        done();
      });
    });
  });

  describe('#search', function() {
    it('should search for an author', function (done) {
      req.where = {
        search: {
          q: 'test'
        }
      };

      var index = {
        search: function(q, searchParams, next) {
          expect(q).to.equal('test');
          next(null, {
            documents: [{
              id: 0
            }, {
              id: 5
            }]
          });
        }
      };

      bookshelfMiddleware.search({index: index})
      (null, req, res, function(err) {
        if(err) return done(err);
        expect(req.where.id).to.deep.equal([0, 5]);
        done();
      });
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

