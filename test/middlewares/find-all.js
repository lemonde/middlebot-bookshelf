var http = require('http');
var expect = require('chai').expect;
var request = require('supertest');
var findAll = require('../../index').findAll;
var db = require('../fixtures/database');

describe('findAll middleware', function () {
  beforeEach(db.reset);

  it('should fetch all authors', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {}, {});

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body.length).to.equal(2);
      expect(res.body.metadata.limit).to.equal(20);
      expect(res.body.metadata.offset).to.equal(0);
      expect(res.body.metadata.count).to.not.exist;
      done();
    });
  });

  it('should be possible to add a withRelated in where', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      id: 2,
      withRelated: 'user'
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body).to.length(1);
      expect(res.body.body[0].user).to.exists;
      done();
    });
  });

  it('should be possible to set a limit', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      limit: 1
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body).to.length(1);
      done();
    });
  });

  it('should be possible to set an offset', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      offset: 1
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body.length).to.equal(1);
      expect(res.body.body[0]).to.have.property('id', 1);
      done();
    });
  });

  it('should be possible to set a sortBy', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      sortBy: 'shortName',
      sortDirection: 'ASC'
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body[0]).to.have.property('id', 1);
      done();
    });
  });

  it('should be possible to set a sortDirection', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      sortBy: 'id',
      sortDirection: 'DESC'
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body[0]).to.have.property('id', 2);
      done();
    });
  });

  it('should be possible to find multiple values', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      id: [1, 2]
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body.length).to.equal(2);
      done();
    });
  });

  it('should be possible to count', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      count: true
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
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

function createServer(opts, body, query, params){
  var _findAll = findAll(opts);

  return http.createServer(function (req, res) {
    req.body = body;
    req.query = query;
    req.params = params;
    _findAll(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = err ? (err.statusCode || 500) : res.statusCode;
      res.end(err ? err.message : JSON.stringify({
        body: res.body,
        metadata: res.metadata
      }));
    });
  });
}