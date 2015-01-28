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
        _pivot_article_id: 1,
        _pivot_author_id: 2,
        created_at: null,
        id: 2,
        long_name: 'George Abitbol2',
        origin: 'L\'homme le plus classe du monde2',
        short_name: 'G.A.2',
        updated_at: null,
        user_id: 1
      }, {
        _pivot_article_id: 1,
        _pivot_author_id: 1,
        created_at: null,
        id: 1,
        long_name: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        short_name: 'G.A.',
        updated_at: null,
        user_id: null
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
        _pivot_article_id: 1,
        _pivot_author_id: 2,
        created_at: null,
        id: 2,
        long_name: 'George Abitbol2',
        origin: 'L\'homme le plus classe du monde2',
        short_name: 'G.A.2',
        updated_at: null,
        user_id: 1
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
        _pivot_article_id: 1,
        _pivot_author_id: 2,
        created_at: null,
        id: 2,
        long_name: 'George Abitbol2',
        origin: 'L\'homme le plus classe du monde2',
        short_name: 'G.A.2',
        updated_at: null,
        user_id: 1
      }, {
        _pivot_article_id: 1,
        _pivot_author_id: 1,
        created_at: null,
        id: 1,
        long_name: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        short_name: 'G.A.',
        updated_at: null,
        user_id: null
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
      query: {sortBy:'long_name'}
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        _pivot_article_id: 1,
        _pivot_author_id: 2,
        created_at: null,
        id: 2,
        long_name: 'George Abitbol2',
        origin: 'L\'homme le plus classe du monde2',
        short_name: 'G.A.2',
        updated_at: null,
        user_id: 1
      }, {
        _pivot_article_id: 1,
        _pivot_author_id: 1,
        created_at: null,
        id: 1,
        long_name: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        short_name: 'G.A.',
        updated_at: null,
        user_id: null
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
        _pivot_article_id: 1,
        _pivot_author_id: 1,
        created_at: null,
        id: 1,
        long_name: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        short_name: 'G.A.',
        updated_at: null,
        user_id: null
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
      query: {short_name: 'G.A.'}
    });

    request(server)
    .get('/')
    .expect(200, {
      body: [{
        _pivot_article_id: 1,
        _pivot_author_id: 1,
        created_at: null,
        id: 1,
        long_name: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        short_name: 'G.A.',
        updated_at: null,
        user_id: null
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
        _pivot_article_id: 1,
        _pivot_author_id: 1,
        created_at: null,
        id: 1,
        long_name: 'George Abitbol',
        origin: 'L\'homme le plus classe du monde',
        short_name: 'G.A.',
        updated_at: null,
        user_id: null
      },
      metadata: {
        count: null,
        limit: 20,
        offset: 0
      }
    }, done);

  });
});
