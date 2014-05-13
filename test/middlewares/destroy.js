var expect = require('chai').expect;
var middlebot = require('middlebot');
var destroyMiddleware = require('../../lib/middlewares/destroy');
var db = require('../fixtures/database');

describe('destroy middleware', function () {
  var app, req, res;

  beforeEach(db.reset);

  beforeEach(function () {
    app = middlebot();
    req = {};
    res = {};
  });

  it('should destroy an author', function (done) {
    req.query = { id: 1 };
    app.use(destroyMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 1 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.be.null;
        done();
      });
    });
  });

  it('should not destroy if author not found', function (done) {
    req.query = { id: 203 };
    app.use(destroyMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 1 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });
});