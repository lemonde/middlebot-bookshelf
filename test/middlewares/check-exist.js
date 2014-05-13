var expect = require('chai').expect;
var middlebot = require('middlebot');
var _ = require('lodash');
var checkExistMiddleware = _.partialRight(require('../../lib/middlewares/check-exist'), true);
var checkNotExistMiddleware = _.partialRight(require('../../lib/middlewares/check-exist'), false);
var db = require('../fixtures/database');

describe('checkExist middleware', function () {
  var app, req, res;

  beforeEach(db.reset);

  beforeEach(function () {
    app = middlebot();
    req = {};
    res = {};
  });

  describe('#checkExist', function () {
    it('should throw an error if the author doesn\'t exists', function (done) {
      req.body = { longName: 'George' };
      app.use(checkExistMiddleware({
        model: db.Author,
        where: 'longName',
        error: 'no author'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.eql('no author');
        done();
      });
    });

    it('should support both camelCase and snakeCase', function (done) {
      req.body = { long_name: 'George Abitbol' };
      app.use(checkExistMiddleware({
        model: db.Author,
        where: 'longName',
        error: 'no author'
      }));
      app.handle('default', req, res, done);
    });

    it('should return an error if keys are missing when strict', function (done) {
      req.body = { longName: 'George' };
      app.use(checkExistMiddleware({
        model: db.Author,
        where: 'missingKey',
        error: 'missing key'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.eql('missing key');
        done();
      });
    });

    it('should not return an error if keys are missing when not strict', function (done) {
      req.body = { longName: 'George' };
      app.use(checkExistMiddleware({
        model: db.Author,
        strict: false,
        where: 'missingKey',
        error: 'missing key'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.be.null;
        done();
      });
    });

    it('should not return an error if keys are missing when not strict (null value)', function (done) {
      req.body = { id: null };
      app.use(checkExistMiddleware({
        model: db.Author,
        strict: false,
        where: 'id',
        error: 'missing key'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.be.null;
        done();
      });
    });

    it('should do nothing if the author exists', function (done) {
      req.body = { id: 1 };
      app.use(checkExistMiddleware({
        model: db.Author,
        strict: false,
        where: '1',
        error: 'error'
      }));
      app.handle('default', req, res, done);
    });
  });

  describe('#checkNotExist', function () {
    it('should throw an error if the author exists', function (done) {
      req.body = { id: 1 };
      app.use(checkNotExistMiddleware({
        model: db.Author,
        where:'id',
        error:'has author'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.eql('has author');
        done();
      });
    });

    it('should return an error if keys are missing when strict', function (done) {
      app.use(checkNotExistMiddleware({
        model: db.Author,
        where: 'missing_key',
        error: 'missing key'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.eql('missing key');
        done();
      });
    });

    it('should not return an error if keys are missing when not strict', function (done) {
      app.use(checkNotExistMiddleware({
        model: db.Author,
        strict: false,
        where: 'missing_key',
        error: 'missing key'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.be.null;
        done();
      });
    });

    it ('should do nothing if the author don\t exists', function (done) {
      req.body = { id: 203 };
      app.use(checkNotExistMiddleware({
        model: db.Author,
        strict: false,
        where: 'missing_key',
        error: 'missing key'
      }));
      app.handle('default', req, res, done);
    });
  });
});