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
    it('should return an error if the author doesn\'t exists', function (done) {
      req.body = { longName: 'Not me' };
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

    it('should not return an error if author exists', function (done) {
      req.body = { longName: 'George Abitbol' };
      app.use(checkExistMiddleware({
        model: db.Author,
        where: 'longName',
        error: 'no author'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.not.exists;
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
      app.handle('default', req, res, function (err) {
        expect(err).to.not.exists;
        done();
      });
    });

    describe('strict mode', function () {
      it('should return an error if one of the key is undefined', function (done) {
        req.body = { longName: 'George' };
          app.use(checkExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.eql('missing key');
          done();
        });
      });

      it('should return an error if one of the key is null', function (done) {
        req.body = { id: null, longName: 'George' };
          app.use(checkExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.eql('missing key');
          done();
        });
      });
    });

    describe('non strict mode', function () {
      it('should not return an error if one of the key is undefined', function (done) {
        req.body = { longName: 'George' };
          app.use(checkExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.not.exists;
          done();
        });
      });

      it('should not return an error if one of the key is null', function (done) {
        req.body = { id: null, longName: 'George' };
          app.use(checkExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.not.exists;
          done();
        });
      });
    });
  });

  describe('#checkNotExist', function () {
    it('should not return an error if the author doesn\'t exists', function (done) {
      req.body = { longName: 'Not me' };
      app.use(checkNotExistMiddleware({
        model: db.Author,
        where: 'longName',
        error: 'no author'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.not.exists;
        done();
      });
    });

    it('should return an error if author exists', function (done) {
      req.body = { longName: 'George Abitbol' };
      app.use(checkNotExistMiddleware({
        model: db.Author,
        where: 'longName',
        error: 'no author'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.equal('no author');
        done();
      });
    });

    it('should support both camelCase and snakeCase', function (done) {
      req.body = { long_name: 'George Abitbol' };
      app.use(checkNotExistMiddleware({
        model: db.Author,
        where: 'longName',
        error: 'no author'
      }));
      app.handle('default', req, res, function (err) {
        expect(err).to.equal('no author');
        done();
      });
    });

    describe('strict mode', function () {
      it('should return an error if one of the key is undefined', function (done) {
        req.body = { longName: 'George' };
          app.use(checkNotExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.eql('missing key');
          done();
        });
      });

      it('should return an error if one of the key is null', function (done) {
        req.body = { id: null, longName: 'George' };
          app.use(checkNotExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.eql('missing key');
          done();
        });
      });
    });

    describe('non strict mode', function () {
      it('should not return an error if one of the key is undefined', function (done) {
        req.body = { longName: 'George' };
          app.use(checkNotExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.not.exists;
          done();
        });
      });

      it('should not return an error if one of the key is null', function (done) {
        req.body = { id: null, longName: 'George' };
          app.use(checkNotExistMiddleware({
          model: db.Author,
          where: ['id', 'longName'],
          error: 'missing key'
        }));
        app.handle('default', req, res, function (err) {
          expect(err).to.not.exists;
          done();
        });
      });
    });
  });
});