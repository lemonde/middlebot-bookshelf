var expect = require('chai').expect;
var middlebot = require('middlebot');
var updateMiddleware = require('../../lib/middlewares/update');
var db = require('../fixtures/database');

describe('update middleware', function () {
  var app, req, res;

  beforeEach(db.reset);

  beforeEach(function () {
    app = middlebot();
    req = {};
    res = {};
  });

  it('should update an author', function (done) {
    req.body = { longName: 'Classe man, top of the pop' };
    req.params = { id: 1 };
    app.use(updateMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body).to.have.property('longName', 'Classe man, top of the pop');
      done();
    });
  });

  it('should return an error if the author to update is not found', function (done) {
    req.params = { id: 10 };
    app.use(updateMiddleware({ model: db.Author, error: new Error('no author') }));
    app.handle('default', req, res, function (err) {
      expect(err).to.have.property('message', 'no author');
      done();
    });
  });

  it('should support withRelated', function (done) {
    req.params = { id: 1 };
    req.query = { withRelated: 'user' };
    app.use(updateMiddleware({ model: db.Author }));
    app.handle('default', req, res, function (err) {
      if (err) return done(err);
      expect(res.body.user).to.exists;
      done();
    });
  });
});