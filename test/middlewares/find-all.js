var expect = require('chai').expect;
var middlebot = require('middlebot');
var findAllMiddleware = require('../../lib/middlewares/find-all');
var db = require('../fixtures/database');

describe('find middleware', function () {
  var app, req, res;

  beforeEach(db.reset);

  beforeEach(function () {
    req = {};
    res = {};
    app = middlebot();
  });

  it('should fetch all authors', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.length).to.equal(2);
      expect(res.metadata.limit).to.equal(20);
      expect(res.metadata.offset).to.equal(0);
      expect(res.metadata.count).to.not.exist;
      done();
    });
  });

  it('should be possible to add a withRelated in where', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { id: 1, withRelated: 'user' };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.length(1);
      expect(res.body[0].user).to.exists;
      done();
    });
  });

  it('should be possible to set a limit', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { limit: 1 };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.length(1);
      done();
    });
  });

  it('should be possible to set an offset', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { offset: 1 };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.length).to.equal(1);
      expect(res.body[0]).to.have.property('id', 1);
      done();
    });
  });

  it('should be possible to set a sortBy', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { sortBy: 'shortName', sortDirection: 'ASC' };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body[0]).to.have.property('id', 1);
      done();
    });
  });

  it('should be possible to set a sortDirection', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { sortBy: 'id', sortDirection: 'DESC' };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body[0]).to.have.property('id', 2);
      done();
    });
  });

  it('should be possible to find multiple values', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { id: [1, 2] };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.length).to.equal(2);
      done();
    });
  });

  it('should be possible to count', function (done) {
    app.use(findAllMiddleware({ model: db.Author }));
    req.query = { count: true };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.metadata).to.eql({
        offset: 0,
        limit: 20,
        count: 2
      });
      done();
    });
  });
});