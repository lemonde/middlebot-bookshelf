var request = require('supertest');
var findRelated = require('../../../index').findRelated;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe.only('find with pivot middleware', function () {
  beforeEach(db.reset);

  it('should be possible to find a related object with pivot table data', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1 }
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 2,
        createdAt: null,
        id: 2,
        longName: 'George Abitbol2',
        origin: 'L\'homme le plus classe du monde2',
        shortName: 'G.A.2',
        updatedAt: null,
        userId: 1
      }, {
        PivotArticleId: 1,
        PivotAuthorId: 1,
        createdAt: null,
        id: 1,
        longName: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        shortName: 'G.A.',
        updatedAt: null,
        userId: null
      }],
      metadata: {
        count: null,
        limit: 20,
        offset: 0
      }
    }, done);
  });

  it('should be possible to limit the number of related objects', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1 },
      query: { limit: 1 }
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 2,
        createdAt: null,
        id: 2,
        longName: 'George Abitbol2',
        origin: 'L\'homme le plus classe du monde2',
        shortName: 'G.A.2',
        updatedAt: null,
        userId: 1
      }],
      metadata: {
        count: null,
        limit: 1,
        offset: 0
      }
    }, done);
  });

  it('should be possible to count the number of related objects');
  it('should be possible to sort the related objects');
  it('should be possible to offset the related objects');
  it('should be possible to offset the related objects');
  it('should be possible to do a where');
});
