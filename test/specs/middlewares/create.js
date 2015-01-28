var request = require('supertest');
var expect = require('chai').expect;
var create = require('../../../index').create;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('create middleware', function () {
  beforeEach(db.reset);

  it('should create an author', function (done) {
    var server = createServer(create({ model: db.Author }), {
      body: {
        long_name: 'Georges Abitbol',
        short_name: 'G.A.'
      }
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
      long_name: 'Georges Abitbol',
      short_name: 'G.A.',
      created_at: null,
      origin: null,
      updated_at: null,
      user_id: null
    })
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 3 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });

  it('should support withRelated', function (done) {
    var server = createServer(create({ model: db.Author }), {
      body: {
        long_name: 'Georges Abitbol',
        short_name: 'G.A.',
        user_id: 1
      },
      query: { withRelated: 'user' }
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
      long_name: 'Georges Abitbol',
      short_name: 'G.A.',
      user_id: 1,
      user: {
        id: 1,
        first_name: 'John'
      },
      created_at: null,
      origin: null,
      updated_at: null
    })
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 3 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });

  it('should create an author with indexKey option', function (done) {
    var server = createServer(create({ model: db.Author, indexKey: 'user_id' }), {
      body: {
        long_name: 'Georges Abitbol',
        short_name: 'G.A.',
        user_id: 23
      }
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
      long_name: 'Georges Abitbol',
      short_name: 'G.A.',
      created_at: null,
      origin: null,
      updated_at: null,
      user_id: 23,
    })
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 3 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });
});
