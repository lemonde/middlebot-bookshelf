var http = require('http');
var request = require('supertest');
var checkExist = require('../../index').checkExist;
var db = require('../fixtures/database');

describe('checkExist middleware', function () {
  beforeEach(db.reset);

  it('should return an error if the author doesn\'t exist', function (done) {
    var server = createServer({
      model: db.Author,
      where: 'longName'
    }, {
      longName: 'not me'
    });

    request(server)
    .get('/')
    .expect(400, 'Relation "authors" doesn\'t exist.', done);
  });

  it('should not return an error if author exists', function (done) {
    var server = createServer({
      model: db.Author,
      where: 'longName'
    }, {
      longName: 'George Abitbol'
    });

    request(server)
    .get('/')
    .expect(200, done);
  });

  it('should support both camelCase and snakeCase', function (done) {
    var server = createServer({
      model: db.Author,
      where: 'longName'
    }, {
      long_name: 'George Abitbol'
    });

    request(server)
    .get('/')
    .expect(200, done);
  });

  describe('strict mode', function () {
    it('should return an error if one of the key is undefined', function (done) {
      var server = createServer({
        model: db.Author,
        where: ['id', 'longName'],
        strict: true
      }, {
        longName: 'George Abitbol'
      });

      request(server)
      .get('/')
      .expect(400, 'Properties are missing ["id"].', done);
    });

    it('should return an error if one of the key is null', function (done) {
      var server = createServer({
        model: db.Author,
        where: ['id', 'longName'],
        strict: true
      }, {
        id: null,
        longName: 'George Abitbol'
      });

      request(server)
      .get('/')
      .expect(400, 'Properties are missing ["id"].', done);
    });
  });

  describe('non strict mode', function () {
    it('should not return an error if one of the key is undefined', function (done) {
      var server = createServer({
        model: db.Author,
        where: ['id', 'longName'],
        strict: false
      }, {
        longName: 'George Abitbol'
      });

      request(server)
      .get('/')
      .expect(200, done);
    });

    it('should not return an error if one of the key is null', function (done) {
      var server = createServer({
        model: db.Author,
        where: ['id', 'longName'],
        strict: false
      }, {
        id: null,
        longName: 'George Abitbol'
      });

      request(server)
      .get('/')
      .expect(200, done);
    });
  });
});

function createServer(opts, body){
  var _checkExist = checkExist(opts);

  return http.createServer(function (req, res) {
    req.body = body;
    _checkExist(req, res, function (err) {
      res.statusCode = err ? (err.statusCode || 500) : res.statusCode;
      res.end(err ? err.message : JSON.stringify(res.body));
    });
  });
}