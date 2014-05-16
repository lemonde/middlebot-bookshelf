var http = require('http');
var request = require('supertest');
var update = require('../../index').update;
var db = require('../fixtures/database');

describe('update middleware', function () {
  beforeEach(db.reset);

  it('should update an author', function (done) {
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Classe man, top of the pop'
    }, {}, {
      id: 1
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
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Classe man, top of the pop'
    }, {}, {
      id: 10
    });

    request(server)
    .get('/')
    .expect(400, 'Author not found.', done);
  });

  it('should support withRelated', function (done) {
    var server = createServer({
      model: db.Author
    }, {
      longName: 'Classe man, top of the pop'
    }, {
      withRelated: 'user'
    }, {
      id: 2
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

function createServer(opts, body, query, params){
  var _update = update(opts);

  return http.createServer(function (req, res) {
    req.body = body;
    req.query = query;
    req.params = params;
    _update(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = err ? (err.statusCode || 500) : res.statusCode;
      res.end(err ? err.message : JSON.stringify(res.body));
    });
  });
}