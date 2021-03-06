var expect = require('chai').expect;
var request = require('supertest');
var findAll = require('../../../index').findAll;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('findAll middleware', function () {
  beforeEach(db.reset);

  it('should fetch all authors', function (done) {
    var server = createServer(findAll({ model: db.Author }));

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body.length).to.equal(2);
      expect(res.body.metadata.limit).to.equal(20);
      expect(res.body.metadata.offset).to.equal(0);
      expect(res.body.metadata.count).to.not.exist;
      done();
    });
  });

  it('should be possible to add a withRelated in where', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        id: 2,
        withRelated: 'user'
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body).to.length(1);
      expect(res.body.body[0].user).to.exists;
      done();
    });
  });

  it('should be possible to set a limit', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        limit: 1
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body).to.length(1);
      done();
    });
  });

  it('should be possible to set an offset', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        offset: 1
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body.length).to.equal(1);
      expect(res.body.body[0]).to.have.property('id', 1);
      done();
    });
  });

  it('should be possible to set a sortBy', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        sortBy: 'shortName',
        sortDirection: 'ASC'
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body[0]).to.have.property('id', 1);
      done();
    });
  });

  it('should be possible to set a sortDirection', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        sortBy: 'id',
        sortDirection: 'DESC'
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body[0]).to.have.property('id', 2);
      done();
    });
  });

  it('should be possible to find multiple values', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        id: [1, 2]
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body.length).to.equal(2);
      done();
    });
  });

  it('should be possible to count', function (done) {
    var server = createServer(findAll({ model: db.Author }), {
      query: {
        count: true
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.metadata).to.eql({
        offset: 0,
        limit: 20,
        count: 2
      });
      done();
    });
  });

  it('should be able to omit parameters from where object', function (done) {
    var server = createServer(findAll({ model: db.Author, omit: ['shortName'] }), {
      query: {
        count: true,
        shortName: 'G.A.2'
      }
    });

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      if (err) return done(err);
      expect(res.body.body).to.length(2);
      done();
    });
  })
});
