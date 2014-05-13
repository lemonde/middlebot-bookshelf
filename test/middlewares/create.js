var expect = require('chai').expect;
var middlebot = require('middlebot');
var createMiddleware = require('../../lib/middlewares/create');
var db = require('../fixtures/database');

describe('create middleware', function () {
  var app, req, res;

  beforeEach(db.reset);

  beforeEach(function () {
    app = middlebot();
    req = {};
    res = {};
  });

  it('should create an author', function (done) {
    req.body = {
      long_name: 'Georges Abitbol',
      short_name: 'G.A.'
    };
    app.use(createMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.exists;
      expect(res.body).to.have.property('longName', 'Georges Abitbol');
      db.Author.forge({ id: 3 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });

  it('should support withRelated', function (done) {
    req.query = { withRelated: 'user' };
    req.body = {
      long_name: 'Georges Abitbol',
      short_name: 'G.A.'
    };
    app.use(createMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.user).to.exists;
      done();
    });
  });
});