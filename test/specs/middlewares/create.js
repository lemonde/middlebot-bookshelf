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
        longName: 'Georges Abitbol',
        shortName: 'G.A.'
      }
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
      legacyAuthorId: null,
      longName: 'Georges Abitbol',
      shortName: 'G.A.',
      createdAt: null,
      origin: null,
      updatedAt: null,
      userId: null
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
        longName: 'Georges Abitbol',
        shortName: 'G.A.',
        userId: 1
      },
      query: { withRelated: 'user' }
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
      legacyAuthorId: null,
      longName: 'Georges Abitbol',
      shortName: 'G.A.',
      userId: 1,
      user: {
        id: 1,
        firstName: 'John'
      },
      createdAt: null,
      origin: null,
      updatedAt: null
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