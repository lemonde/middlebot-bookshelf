'use strict';

var request = require('supertest');
var findRelated = require('../../../index').findRelated;
var db = require('../../fixtures/database');
var createServer = require('../../utils/http').createServer;

describe('find with related middleware', function () {
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
        legacyAuthorId: 2,
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
        legacyAuthorId: 3,
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

  it('should be possible to specify default option "target"', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors', target: 'legacy_item_id' }), {
      params: { id: 5 },
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 2,
        createdAt: null,
        id: 2,
        legacyAuthorId: 2,
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
        legacyAuthorId: 3,
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
        legacyAuthorId: 2,
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

  it('should be possible to count the number of related objects', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1 },
      query: {count: true}
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 2,
        createdAt: null,
        id: 2,
        legacyAuthorId: 2,
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
        legacyAuthorId: 3,
        longName: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        shortName: 'G.A.',
        updatedAt: null,
        userId: null
      }],
      metadata: {
        count: 2,
        limit: 20,
        offset: 0
      }
    }, done);

  });

  it('should be possible to sort the related objects', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1 },
      query: {sortBy:'longName'}
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 2,
        createdAt: null,
        id: 2,
        legacyAuthorId: 2,
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
        legacyAuthorId: 3,
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
  it('should be possible to offset the related objects', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1 },
      query: {limit: 1, offset:1}
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 1,
        createdAt: null,
        id: 1,
        legacyAuthorId: 3,
        longName: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        shortName: 'G.A.',
        updatedAt: null,
        userId: null
      }],
      metadata: {
        count: null,
        limit: 1,
        offset: 1
      }
    }, done);
  });

  it('should be possible to do a where', function (done) {

    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1 },
      query: {shortName: 'G.A.'}
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        PivotArticleId: 1,
        PivotAuthorId: 1,
        createdAt: null,
        id: 1,
        legacyAuthorId: 3,
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

  it('should be possible to only get one of the related items', function (done) {
    var server = createServer(findRelated({ model: db.Article, related: 'authors' }), {
      params: { id: 1, relatedIndex: 2 }
    });

    request(server)
    .get('/')
    .expect(200, {
      body: {
        PivotArticleId: 1,
        PivotAuthorId: 1,
        createdAt: null,
        id: 1,
        legacyAuthorId: 3,
        longName: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        shortName: 'G.A.',
        updatedAt: null,
        userId: null
      },
      metadata: {
        count: null,
        limit: 20,
        offset: 0
      }
    }, done);

  });
});
