var http = require('http');
var request = require('supertest');
var expect = require('chai').expect;
var destroy = require('../../index').destroy;
var db = require('../fixtures/database');

describe('destroy middleware', function () {
  beforeEach(db.reset);

  it('should destroy an author', function (done) {
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Georges Abitbol',
      shortName: 'G.A.'
    }, {}, {
      id: 1
    });

    request(server)
    .get('/')
    .expect(204)
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 1 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.be.null;
        done();
      });
    });
  });

  it('should not destroy if author not found', function (done) {
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Georges Abitbol',
      shortName: 'G.A.'
    }, {}, {
      id: 203
    });

    request(server)
    .get('/')
    .expect(204)
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 1 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });
});

function createServer(opts, body, query, params){
  var _destroy = destroy(opts);

  return http.createServer(function (req, res) {
    req.body = body;
    req.query = query;
    req.params = params;
    _destroy(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = res.statusCode || (err ? (err.statusCode || 500) : 200);
      res.end(err ? err.message : JSON.stringify(res.body));
    });
  });
}