'use strict';

var chai = require('chai');
var expect = chai.expect;

var PgDatabase = require('pg-database');
var authorSchema = require('pg-database/lib/schemas/authors');
var bookshelfMiddleware = require('../');

var database = new PgDatabase({
      'client': 'sqlite',
      'connection': {
        'filename': ':memory:'
      },
      'pool': {
        'max': 1
      }
    });

var bookshelf = database.bookshelf;

describe('CRUD methods on ORM objects', function () {
  var res, req, knex;

  beforeEach(function (done) {

    knex = database.bookshelf.knex;
    resetTable(done);

    res = {};
    req = {};
  });

  describe('#find', function() {
    it('should be possible to find an object by id', function (done) {
      req.where = {id: 1};

      bookshelfMiddleware.find({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.attributes.long_name).to.equal('George Abitbol');
        expect(res.body.attributes.short_name).to.equal('G.A.');
        done();
      });
    });

    it('should return null when an object is not found', function (done) {
      req.where = {id: 10};

      bookshelfMiddleware.find({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.be.null;
        done();
      });
    });

    it('should be possible to add withRelated option in where', function (done) {
      req.where = {id: 1};
      req.opts = {withRelated: 'user'};

      bookshelfMiddleware.find({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        done();
      });
    });

    it('should fetch an author its long name', function (done) {
      req.where = {long_name: 'George Abitbol'};

      bookshelfMiddleware.find({model: database.Author})
      (req, res, function (err) {
        if (err) done(err);
        expect(res.body.attributes.long_name).to.equal('George Abitbol');
        expect(res.body.attributes.short_name).to.equal('G.A.');
        done();
      });
    });
  });

  describe('#findAll', function() {
    it('should fetch all authors', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(2);
        expect(res.metadata.limit).to.equal(20);
        expect(res.metadata.offset).to.equal(0);
        expect(res.metadata.count).to.not.exist;
        done();
      });
    });

    it('should be possible to find objects by function', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      req.where = function (qb) {
        qb.where({id: 1});
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.length(1);
        expect(res.body.models[0]).to.have.property('id', 1);
        done();
      });
    });

    it('should be possible to add a withRelated in where', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      req.where = {id: 1, withRelated: 'user'};

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.length(0);
        done();
      });
    });

    it('should be possible to set a limit', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 1,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        done();
      });
    });

    it('should be possible to set an offset', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 10,
        offset: 1,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        expect(res.body.models[0]).to.have.property('id', 1);
        done();
      });
    });

    it('should be possible to set a sortBy', function (done) {
      req.options = {
        sortBy: 'shortName',
        sortDirection: 'ASC',
        limit: 10,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.models[0]).to.have.property('id', 1);
        done();
      });
    });

    it('should be possible to set a sortDirection', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'DESC',
        limit: 10,
        offset: 0,
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.models[0]).to.have.property('id', 2);
        done();
      });
    });

    it('should be possible to find multiple values', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
      };

      req.whereIn = {id: [1, 2]};

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(2);
        done();
      });
    });

    it('should be possible to count', function (done) {
      req.options = {
        sortBy: 'id',
        sortDirection: 'desc',
        limit: 20,
        offset: 0,
        count: true
      };

      bookshelfMiddleware.findAll({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.metadata).to.eql({
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
      req.body = {
        long_name: 'Georges Abitbol',
        short_name: 'G.A.'
      };
      bookshelfMiddleware.create({model: database.Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.exists;
        expect(res.body.attributes.long_name).to.equal('Georges Abitbol');

        req.options = {
          sortBy: 'id',
          sortDirection: 'desc',
          limit: 20,
          offset: 0,
        };
        bookshelfMiddleware.findAll({model: database.Author})
        (req, res, function (){
          expect(res.body.length).to.equal(3);
          done();
        });
      });
    });
  });

  describe('#destroy', function() {
    it('should destroy an author', function (done) {
      req = {
        query: {
          id: 1
        }
      };
      bookshelfMiddleware.destroy({model: database.Author})
      (req, res, function (err) {
        if(err) return done(err);
        expect(res.body).to.exists;

        req.options = {
          sortBy: 'id',
          sortDirection: 'desc',
          limit: 20,
          offset: 0,
        };
        bookshelfMiddleware.findAll({model: database.Author})
        (req, res, function (){
          expect(res.body.length).to.equal(1);
          done();
        });
      });
    });

    it('should not destroy if author not found', function (done) {
      req = {
        query: {
          id: 10
        }
      }
      bookshelfMiddleware.destroy({model: database.Author})
      (req, res, function (err) {
        if(err) return done(err);
        expect(res.body).to.exists;

        req.options = {
          sortBy: 'id',
          sortDirection: 'desc',
          limit: 20,
          offset: 0,
        };
        bookshelfMiddleware.findAll({model: database.Author})
        (req, res, function (){
          expect(res.body.length).to.equal(2);
          done();
        });
      });
    });
  });

  describe('#search', function() {
    it('should search for an author', function (done) {
      req.query= {
          q: 'test'
      };

      function search(q, searchParams, next) {
        expect(q).to.equal('test');
        next(null, {
          documents: [{
            id: 0
          }, {
            id: 5
          }]
        });
      };

      bookshelfMiddleware.search({search: search})
      (req, res, function(err) {
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

describe('req and res formatters', function() {
  describe('snake case formatter', function() {
    it('should convert camel-case keys to snake case', function() {
      var input = {
        where: {
          testData : 1,
          AnotherTestData : 'test'
        }
      };

      bookshelfMiddleware.snakeCaseKeys({key: 'where'})(input, {}, function() {
        expect(input.where.testData).to.not.exists;
        expect(input.where.AnotherTestData).to.not.exists;
        expect(input.where.test_data).to.exists;
        expect(input.where.another_test_data).to.exists;
      });
    });

    it('should work with deep', function () {

      var input = {};
      input.where = {
        ar: [
          {
            bigTest: true
          }
        ],
        foo: { barTrue: true }
      };

      bookshelfMiddleware.snakeCaseKeys({key: 'where'})(input, {}, function() {
        expect(input.where).to.eql({
          ar: [
            {
              big_test: true
            }
          ],
          foo: { bar_true: true }
        });
      });
    });
  });

  describe('#camelizeKeys', function () {
    it('should camelize all keys', function () {
      var input = {
        where:{
          first_name: 'Johny',
          last_name: 'Begood'
        }
      };

      bookshelfMiddleware.camelizeKeys({key: 'where'})(input, {}, function() {
        expect(input.where).to.eql({
          firstName: 'Johny',
          lastName: 'Begood'
        });
      });
    });
  });

    it('should work with deep', function () {
    var input = {
      where:{
        ar: [
          {
            big_test: true
          }
        ],
        foo: { bar_true: true }
      }
    };
    bookshelfMiddleware.camelizeKeys({key: 'where'})(input, {}, function() {
      expect(input.where).to.eql({
        ar: [
          {
            bigTest: true
          }
        ],
        foo: { barTrue: true }
      });
    });
  });

  describe('#formatFindAllOptions', function() {
    it('should provide default for findAll query', function () {
      var input = {};
      bookshelfMiddleware.formatFindAllOptions()(input, {}, function() {
        expect(input).to.deep.equal({
          options: {
            sortBy: 'id', sortDirection: 'desc', limit:20, offset:0,
            whereIn: {}
          },
          where: {}
        });
      });
    });

    it('should not override provided parameters', function () {
      var input = {
        options: {
          sortBy:'test',
          sortDirection: 'asc'
        }
      };
      bookshelfMiddleware.formatFindAllOptions()(input, {}, function() {
        expect(input.options.sortBy).to.equal('test');
        expect(input.options.sortDirection).to.equal('asc');
      });
    });

    it('should not convert input if query is a function', function () {
      var input = {
        query: function () {}
      };
      bookshelfMiddleware.formatFindAllOptions()(input, {}, function() {
        expect(input.where).to.be.a('function');
      });

    });

    it('should remove array from where value', function () {
      var input = {
        query: {id: [1, 2]}
      };

      bookshelfMiddleware.formatFindAllOptions()(input, {}, function() {
        expect(input.where).to.be.empty;
        expect(input.options.whereIn).to.eql({id: [1,2]});
      });
    });
  });

  describe('#formatFindOptions', function() {
    it('should provide default for find query', function() {
      var input = {};
      bookshelfMiddleware.formatFindOptions()(input, {}, function() {
        expect(input).to.deep.equal({
          options: {},
          where: {id: undefined}
        });
      });
    });

    it('should convert where to an object', function () {
      var input = {
        query: 1
      };
      bookshelfMiddleware.formatFindOptions()(input, {}, function() {
        expect(input.where).to.eql({ id: 1 });
      });

    });

    it('should pick withRelated from where', function () {
      var input = {
        query: {
          withRelated: 'test'
        }
      };
      bookshelfMiddleware.formatFindOptions()(input, {}, function() {
        expect(input.options.withRelated).to.eql('test');
        expect(input.where.withRelated).to.not.exists;
      });
    });
  });

  describe('#formatBackboneModel', function () {
    it('should convert model to JSON', function () {
      var model = new bookshelf.Model({ big_foo: 'bar' });

      var res = {};
      res.body = model;

      bookshelfMiddleware.formatBackboneModel()({}, res, function() {
        expect(res.body).to.eql({ bigFoo: 'bar' });
      });
    });
  });

  describe('#formatBackboneCollection', function () {
    it('should convert collection to JSON', function () {
      var model = new bookshelf.Model({ big_foo: 'bar' });
      var collection = new bookshelf.Collection([model]);

      var res = {};
      res.body = collection;

      bookshelfMiddleware.formatBackboneCollection()({}, res, function() {
        expect(res.body).to.eql([{ bigFoo: 'bar' }]);
      });
    });
  });
});
