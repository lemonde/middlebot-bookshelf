var request = require('supertest');
var update = require('../../../index').update;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('update middleware', function () {
  beforeEach(db.reset);

  it('should update an author', function (done) {
    var server = createServer(update({ model: db.Author }), {
      body: { longName: 'Classe man, top of the pop' },
      params: { id: 1 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 1,
      longName: 'Classe man, top of the pop',
      shortName: 'G.A.',
      createdAt: null,
      origin: 'L\'homme le plus classe du monde',
      updatedAt: null,
      userId: null
    }, done);
  });

  it('should return an error if the author to update is not found', function (done) {
    var server = createServer(update({ model: db.Author }), {
      body: { longName: 'Classe man, top of the pop' },
      params: { id: 10 }
    });

    request(server)
    .get('/')
    .expect(400, 'Author not found.', done);
  });

  it('should support withRelated', function (done) {
    var server = createServer(update({ model: db.Author }), {
      body: { longName: 'Classe man, top of the pop' },
      query: { withRelated: 'user' },
      params: { id: 2 }
    });

    request(server)
    .get('/')
    .expect(200, {
      id: 2,
      longName: 'Classe man, top of the pop',
      shortName: 'G.A.2',
      createdAt: null,
      origin: 'L\'homme le plus classe du monde2',
      updatedAt: null,
      userId: 1,
      user: {
        firstName: 'John',
        id: 1
      }
    }, done);
  });
});