var request = require('supertest');
var expect = require('chai').expect;
var destroy = require('../../../index').destroy;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('destroy middleware', function () {
  beforeEach(db.reset);

  it('should destroy an author', function (done) {
    var server = createServer(destroy({ model: db.Author }), {
      body: {
        longName: 'Georges Abitbol',
        shortName: 'G.A.'
      },
      params: { id: 1 }
    });

    request(server)
    .get('/')
    .expect(204)
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 1 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.be.null;
        done();
      });
    });
  });

  it('should not destroy if author not found', function (done) {
    var server = createServer(destroy({ model: db.Author }), {
      body: {
        longName: 'Georges Abitbol',
        shortName: 'G.A.'
      },
      params: { id: 203 }
    });

    request(server)
    .get('/')
    .expect(204)
    .end(function (err) {
      if (err) return done(err);
      db.Author.forge({ id: 1 }).fetch().exec(function (err, model) {
        if (err) return done(err);
        expect(model).to.not.be.null;
        done();
      });
    });
  });
});