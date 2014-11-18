var request = require('supertest');
var find = require('../../../index').find;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('find middleware', function () {
  beforeEach(db.reset);

  it('should be possible to find an object by id', function (done) {
    var server = createServer(find({ model: db.Author }), {
      params: { id: 1 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 1,
      longName: 'George Abitbol',
      shortName: 'G.A.',
      createdAt: null,
      origin: 'L\'homme le plus classe du monde',
      updatedAt: null,
      userId: null
    }, done);
  });

  it('should return an error when an object is not found', function (done) {
    var server = createServer(find({ model: db.Author }), {
      params: { id: 2994 }
    });

    request(server)
    .get('/')
    .expect(400, 'Author not found.', done);
  });

  it('should return a custom error when an object is not found and one is provided', function (done) {
    var server = createServer(find({ model: db.Author, error: new Error('custom error') }), {
      params: { id: 2994 }
    });

    request(server)
    .get('/')
    .expect(500, 'custom error', done);
  });

  it('should be possible to add "withRelated" option in where', function (done) {
    var server = createServer(find({ model: db.Author }), {
      query: { withRelated: 'user' },
      params: { id: 2 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 2,
      longName: 'George Abitbol2',
      shortName: 'G.A.2',
      createdAt: null,
      origin: 'L\'homme le plus classe du monde2',
      updatedAt: null,
      userId: 1,
      user: {
        id: 1,
        firstName: 'John'
      }
    }, done);
  });

  it('should be possible to specify default option "withRelated"', function (done) {
    var server = createServer(find({
      model: db.Author,
      withRelated: 'user'
    }), {
      params: { id: 2 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 2,
      longName: 'George Abitbol2',
      shortName: 'G.A.2',
      createdAt: null,
      origin: 'L\'homme le plus classe du monde2',
      updatedAt: null,
      userId: 1,
      user: {
        id: 1,
        firstName: 'John'
      }
    }, done);
  });
});
