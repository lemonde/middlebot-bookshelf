var request = require('supertest');
var checkExist = require('../../../index').checkExist;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('checkExist middleware', function () {
  beforeEach(db.reset);

  it('should return an error if the author doesn\'t exist', function (done) {
    var server = createServer(checkExist({
      model: db.Author,
      where: 'longName'
    }), {
      body: { longName: 'not me' }
    });

    request(server)
    .get('/')
    .expect(400, 'Relation "authors" doesn\'t exist.', done);
  });

  it('should return a custom error if the author doesn\'t exist and one is provided', function (done) {
    var server = createServer(checkExist({
      error: new Error('custom error'),
      model: db.Author,
      where: 'longName'
    }), {
      body: { longName: 'not me' }
    });

    request(server)
    .get('/')
    .expect(500, 'custom error', done);
  });

  it('should not return an error if author exists', function (done) {
    var server = createServer(checkExist({
      model: db.Author,
      where: 'longName'
    }), {
      body: { longName: 'George Abitbol' }
    });

    request(server)
    .get('/')
    .expect(200, done);
  });

  it('should support both camelCase and snakeCase', function (done) {
    var server = createServer(checkExist({
      model: db.Author,
      where: 'longName'
    }), {
      body: { long_name: 'George Abitbol' }
    });

    request(server)
    .get('/')
    .expect(200, done);
  });

  it('should support where as a function', function (done) {
    var server = createServer(checkExist({
      model: db.Author,
      where: function (req, res, qb) {
        qb.where({long_name: 'George Abitbol'});
      }
    }));

    request(server)
    .get('/')
    .expect(200, done);
  });

  describe('strict mode', function () {
    it('should return an error if one of the key is undefined', function (done) {
      var server = createServer(checkExist({
        model: db.Author,
        where: ['id', 'longName'],
        strict: true
      }), {
        body: { longName: 'George Abitbol' }
      });

      request(server)
      .get('/')
      .expect(400, 'Properties are missing ["id"].', done);
    });

    it('should return an error if one of the key is null', function (done) {
      var server = createServer(checkExist({
        model: db.Author,
        where: ['id', 'longName'],
        strict: true
      }), {
        body: { id: null, longName: 'George Abitbol' }
      });

      request(server)
      .get('/')
      .expect(400, 'Properties are missing ["id"].', done);
    });
  });

  describe('non strict mode', function () {
    it('should not return an error if one of the key is undefined', function (done) {
      var server = createServer(checkExist({
        model: db.Author,
        where: ['id', 'longName'],
        strict: false
      }), {
        body: { longName: 'George Abitbol' }
      });

      request(server)
      .get('/')
      .expect(200, done);
    });

    it('should not return an error if one of the key is null', function (done) {
      var server = createServer(checkExist({
        model: db.Author,
        where: ['id', 'longName'],
        strict: false
      }), {
        body: { id: null, longName: 'George Abitbol' }
      });

      request(server)
      .get('/')
      .expect(200, done);
    });
  });
});
