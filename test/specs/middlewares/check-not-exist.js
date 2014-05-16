var request = require('supertest');
var checkNotExist = require('../../../index').checkNotExist;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('checkNotExist middleware', function () {
  beforeEach(db.reset);

  it('should return an error if the author exists', function (done) {
    var server = createServer(checkNotExist({
      model: db.Author,
      where: 'longName'
    }), {
      body: { longName: 'George Abitbol' }
    });

    request(server)
    .get('/')
    .expect(400, 'Relation "authors" already exists.', done);
  });

  it('should not return an error if author doesn\'t exist', function (done) {
    var server = createServer(checkNotExist({
      model: db.Author,
      where: 'longName'
    }), {
      body: { longName: 'not me' }
    });

    request(server)
    .get('/')
    .expect(200, done);
  });

  it('should support both camelCase and snakeCase', function (done) {
    var server = createServer(checkNotExist({
      model: db.Author,
      where: 'longName'
    }), {
      body: { long_name: 'not me' }
    });

    request(server)
    .get('/')
    .expect(200, done);
  });

  it('should support where as a function', function (done) {
    var server = createServer(checkNotExist({
      model: db.Author,
      where: function (req, res, qb) {
        qb.where({long_name: 'not me'});
      }
    }));

    request(server)
    .get('/')
    .expect(200, done);
  });

  describe('strict mode', function () {
    it('should return an error if one of the key is undefined', function (done) {
      var server = createServer(checkNotExist({
        model: db.Author,
        where: ['id', 'longName'],
        strict: true
      }), {
        body: { longName: 'not me' }
      });

      request(server)
      .get('/')
      .expect(400, 'Properties are missing ["id"].', done);
    });

    it('should return an error if one of the key is null', function (done) {
      var server = createServer(checkNotExist({
        model: db.Author,
        where: ['id', 'longName'],
        strict: true
      }), {
        body: { id: null, longName: 'not me' }
      });

      request(server)
      .get('/')
      .expect(400, 'Properties are missing ["id"].', done);
    });
  });

  describe('non strict mode', function () {
    it('should not return an error if one of the key is undefined', function (done) {
      var server = createServer(checkNotExist({
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
      var server = createServer(checkNotExist({
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