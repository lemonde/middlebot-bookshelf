'use strict';

var chai = require('chai');
var expect = chai.expect;
var bookshelfMiddleware = require('../');
var Bookshelf = require('bookshelf');
var bookshelf = Bookshelf.initialize({
  client: 'sqlite',
  connection: {
    filename: ':memory:'
  },
  pool: {
    max: 1
  }
});
var knex = bookshelf.knex;

var User = bookshelf.Model.extend({
  tableName: 'users'
});
var Author = bookshelf.Model.extend({
  tableName: 'authors',
  user: function() {
    return this.belongsTo(User, 'user_id');
  }
});

function resetTable(done) {
  knex.schema.dropTableIfExists('authors')
  .then(function () {
    return knex.schema.createTable('authors', function (table) {
      table.engine('InnoDB');
      table.timestamps();
      table.charset('utf8');
      table.increments('id').primary();
      table.string('long_name');
      table.string('short_name');
      table.string('origin');
    });
  })
  .then(function () {
    return Author.forge().save({
      long_name: 'George Abitbol',
      short_name: 'G.A.',
      origin: 'L\'homme le plus classe du monde'
    });
  })
  .then(function () {
    return Author.forge().save({
      long_name: 'George Abitbol2',
      short_name: 'G.A.2',
      origin: 'L\'homme le plus classe du monde2'
    });
  })
  .exec(function () {
    knex.schema.dropTableIfExists('users')
    .then(function () {
      return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password', 60).notNullable();
        table.string('first_name');
        table.string('last_name');
        table.integer('current_role_id').index();
        table.integer('current_section_id').index();
      });
    })
    .exec(done);
  });
}

describe('CRUD methods on ORM objects', function () {
  var req, res;

  beforeEach(function () {
    req = {};
    res = {};
  });

  beforeEach(resetTable);

  describe('#find', function() {
    it('should be possible to find an object by id', function (done) {
      req.query = {id: 1};

      bookshelfMiddleware.find({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.longName).to.equal('George Abitbol');
        expect(res.body.shortName).to.equal('G.A.');
        done();
      });
    });

    it('should return null when an object is not found', function (done) {
      req.query = {id: 10};

      bookshelfMiddleware.find({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.be.null;
        done();
      });
    });

    it('should be possible to add withRelated option in where', function (done) {
      req.query = {id: 1, withRelated: 'user'};

      bookshelfMiddleware.find({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.user).to.exists;
        done();
      });
    });

    it('should fetch an author its long name', function (done) {
      req.query = {long_name: 'George Abitbol'};

      bookshelfMiddleware.find({model: Author})
      (req, res, function (err) {
        if (err) done(err);
        expect(res.body.longName).to.equal('George Abitbol');
        expect(res.body.shortName).to.equal('G.A.');
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

      bookshelfMiddleware.findAll({model: Author})
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

      req.query = function (qb) {
        qb.where({id: 1});
      };

      bookshelfMiddleware.findAll({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.length(1);
        expect(res.body[0]).to.have.property('id', 1);
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

      req.query = {id: 1, withRelated: 'user'};

      bookshelfMiddleware.findAll({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.length(1);
        expect(res.body[0].user).to.exists;
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

      bookshelfMiddleware.findAll({model: Author})
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

      bookshelfMiddleware.findAll({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        expect(res.body[0]).to.have.property('id', 1);
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

      bookshelfMiddleware.findAll({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body[0]).to.have.property('id', 1);
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

      bookshelfMiddleware.findAll({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body[0]).to.have.property('id', 2);
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

      req.query = {id: [1, 2]};

      bookshelfMiddleware.findAll({model: Author})
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

      bookshelfMiddleware.findAll({model: Author})
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
      bookshelfMiddleware.create({model: Author})
      (req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.exists;
        expect(res.body.longName).to.equal('Georges Abitbol');

        req.options = {
          sortBy: 'id',
          sortDirection: 'desc',
          limit: 20,
          offset: 0,
        };
        bookshelfMiddleware.findAll({model: Author})
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
      bookshelfMiddleware.destroy({model: Author})
      (req, res, function (err) {
        if(err) return done(err);
        expect(res.body).to.exists;

        req.options = {
          sortBy: 'id',
          sortDirection: 'desc',
          limit: 20,
          offset: 0,
        };
        req.query = {};
        bookshelfMiddleware.findAll({model: Author})
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
      };

      bookshelfMiddleware.destroy({model: Author})
      (req, res, function (err) {
        if(err) return done(err);
        expect(res.body).to.exists;

        req.options = {
          sortBy: 'id',
          sortDirection: 'desc',
          limit: 20,
          offset: 0,
        };
        req.query = {};
        bookshelfMiddleware.findAll({model: Author})
        (req, res, function (){
          expect(res.body.length).to.equal(2);
          done();
        });
      });
    });
  });

  describe('#search', function() {
    it('should search for an author', function (done) {
      req.query = {
        q: 'test'
      };

      function search (q, searchParams, next) {
        expect(q).to.equal('test');
        next(null, {
          documents: [{
            id: 0
          }, {
            id: 5
          }]
        });
      }

      bookshelfMiddleware.search({search: search})
      (req, res, function(err) {
        if(err) return done(err);
        expect(req.where.id).to.deep.equal([0, 5]);
        done();
      });
    });
  });

  describe('#checkExist', function() {
    it('should throw an error if the author doesn\'t exists', function (done) {
      req.body = {
        long_name: 'George'
      };

      bookshelfMiddleware.checkExist({
        model: Author,
        where:'long_name',
        error:'no author'})
      (req, {}, function (err) {
        expect(err).to.eql('no author');
        done();
      });
    });

    it ('should do nothing if the author exists', function (done) {
      req.body = {
        id: 1
      };

      bookshelfMiddleware.checkExist({
        model: Author,
        where:'id',
        error:'no author'})
      (req, {}, function (err) {
        expect(err).to.be.undefined;
        done();
      });
    });
  });

  describe('#checkNotExist', function() {
    it('should throw an error if the author exists', function (done) {
      req.body = {
        id: 1
      };

      bookshelfMiddleware.checkNotExist({
        model: Author,
        where:'id',
        error:'has author'})
      (req, {}, function (err) {
        expect(err).to.eql('has author');
        done();
      });
    });

    it ('should do nothing if the author don\t exists', function (done) {
      req.body = {
        id: 10
      };

      bookshelfMiddleware.checkNotExist({
        model: Author,
        where:'id',
        error:'has author'})
      (req, {}, function (err) {
        expect(err).to.be.undefined;
        done();
      });
    });
  });

});

