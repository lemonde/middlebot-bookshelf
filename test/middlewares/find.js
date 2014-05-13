var expect = require('chai').expect;
var middlebot = require('middlebot');
var findMiddleware = require('../../lib/middlewares/find');
var db = require('../fixtures/database');

describe('find middleware', function () {
  var app, req, res;

  beforeEach(db.reset);

  beforeEach(function () {
    req = {};
    res = {};
    app = middlebot();
  });

  it('should be possible to find an object by id', function (done) {
    app.use(findMiddleware({ model: db.Author }));
    req.query = { id: 1 };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.have.property('longName', 'George Abitbol');
      expect(res.body).to.have.property('shortName', 'G.A.');
      done();
    });
  });

  it('should return null when an object is not found', function (done) {
    app.use(findMiddleware({ model: db.Author }));
    req.query = { id: 2993 };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.be.null;
      done();
    });
  });

  it('should be possible to add "withRelated" option in where', function (done) {
    app.use(findMiddleware({ model: db.Author }));
    req.query = { id: 1, withRelated: 'user' };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.user).to.exists;
      done();
    });
  });

  it('should be possible to specify default option "withRelated"', function (done) {
    app.use(findMiddleware({ model: db.Author, withRelated: 'user' }));
    req.query = { id: 1 };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.user).to.exists;
      done();
    });
  });

  it('should fetch an author its long name', function (done) {
    app.use(findMiddleware({ model: db.Author }));
    req.query = { longName: 'George Abitbol' };
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.have.property('longName', 'George Abitbol');
      expect(res.body).to.have.property('shortName', 'G.A.');
      done();
    });
  });
});