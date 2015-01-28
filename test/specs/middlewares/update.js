var request = require('supertest');
var update = require('../../../index').update;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('update middleware', function () {
  beforeEach(db.reset);

  it('should update an author', function (done) {
    var server = createServer(update({ model: db.Author }), {
      body: { long_name: 'Classe man, top of the pop' },
      params: { id: 1 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 1,
      long_name: 'Classe man, top of the pop',
      short_name: 'G.A.',
      created_at: null,
      origin: 'L\'homme le plus classe du monde',
      updated_at: null,
      user_id: null
    }, done);
  });

  it('should return an error if the author to update is not found', function (done) {
    var server = createServer(update({ model: db.Author }), {
      body: { long_name: 'Classe man, top of the pop' },
      params: { id: 10 }
    });

    request(server)
    .get('/')
    .expect(400, JSON.stringify('Author not found.'), done);
  });

  it('should return a custom error if the author to update is not found and one is provided', function (done) {
    var server = createServer(update({ model: db.Author, error: new Error('custom error') }), {
      body: { long_name: 'Classe man, top of the pop' },
      params: { id: 10 }
    });

    request(server)
    .get('/')
    .expect(500, JSON.stringify('custom error'), done);
  });

  it('should support withRelated', function (done) {
    var server = createServer(update({ model: db.Author }), {
      body: { long_name: 'Classe man, top of the pop' },
      query: { withRelated: 'user' },
      params: { id: 2 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 2,
      long_name: 'Classe man, top of the pop',
      short_name: 'G.A.2',
      created_at: null,
      origin: 'L\'homme le plus classe du monde2',
      updated_at: null,
      user_id: 1,
      user: {
        first_name: 'John',
        id: 1
      }
    }, done);
  });
});
