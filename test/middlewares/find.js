var http = require('http');
var request = require('supertest');
var find = require('../../index').find;
var db = require('../fixtures/database');

describe('find middleware', function () {
  beforeEach(db.reset);

  it('should be possible to find an object by id', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {}, {
      id: 1
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

  it('should return null when an object is not found', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {}, {
      id: 2993
    });

    request(server)
    .get('/')
    .expect(400, 'Author not found.', done);
  });

  it('should be possible to add "withRelated" option in where', function (done) {
    var server = createServer({
      model: db.Author
    }, {}, {
      withRelated: 'user'
    }, {
      id: 2
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
    var server = createServer({
      model: db.Author,
      withRelated: 'user'
    }, {}, {}, {
      id: 2
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

function createServer(opts, body, query, params){
  var _find = find(opts);

  return http.createServer(function (req, res) {
    req.body = body;
    req.query = query;
    req.params = params;
    _find(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = err ? (err.statusCode || 500) : res.statusCode;
      res.end(err ? err.message : JSON.stringify(res.body));
    });
  });
}