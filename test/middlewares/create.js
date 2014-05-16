var http = require('http');
var request = require('supertest');
var expect = require('chai').expect;
var create = require('../../index').create;
var db = require('../fixtures/database');

describe('create middleware', function () {
  beforeEach(db.reset);

  it('should create an author', function (done) {
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Georges Abitbol',
      shortName: 'G.A.'
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
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
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Georges Abitbol',
      shortName: 'G.A.',
      userId: 1
    }, {
      withRelated: 'user'
    });

    request(server)
    .get('/')
    .expect(201, {
      id: 3,
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

function createServer(opts, body, query){
  var _create = create(opts);

  return http.createServer(function (req, res) {
    req.body = body;
    req.query = query;
    _create(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = err ? (err.statusCode || 500) : res.statusCode;
      res.end(err ? err.message : JSON.stringify(res.body));
    });
  });
}