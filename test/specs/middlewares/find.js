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
      long_name: 'George Abitbol',
      short_name: 'G.A.',
      created_at: null,
      origin: 'L\'homme le plus classe du monde',
      updated_at: null,
      user_id: null
    }, done);
  });

  it('should return an error when an object is not found', function (done) {
    var server = createServer(find({ model: db.Author }), {
      params: { id: 2994 }
    });

    request(server)
    .get('/')
    .expect(400, JSON.stringify('Author not found.'), done);
  });

  it('should return a custom error when an object is not found and one is provided', function (done) {
    var server = createServer(find({ model: db.Author, error: new Error('custom error') }), {
      params: { id: 2994 }
    });

    request(server)
    .get('/')
    .expect(500, JSON.stringify('custom error'), done);
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
      long_name: 'George Abitbol2',
      short_name: 'G.A.2',
      created_at: null,
      origin: 'L\'homme le plus classe du monde2',
      updated_at: null,
      user_id: 1,
      user: {
        id: 1,
        first_name: 'John'
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
      long_name: 'George Abitbol2',
      short_name: 'G.A.2',
      created_at: null,
      origin: 'L\'homme le plus classe du monde2',
      updated_at: null,
      user_id: 1,
      user: {
        id: 1,
        first_name: 'John'
      }
    }, done);
  });
});
