'use strict';

var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');

var db = require('../../fixtures/database');

var where = require('../../../lib/middlewares/where');

describe('build where', function () {
  beforeEach(db.reset);

  it('should build the where object for the following requests', function (done) {

    var app = express();
    app.get('/articleAuthors/:id',
            where({
              model: db.ArticleAuthor,
              where: function (req) {
                return {article_id: req.params.id};
              },
              key: 'authorId'
            }));

    app.use(function (req, res) {
      expect(req.query.id).to.eql([1, 2]);
      res.end('done');
    });

    request(app)
    .get('/articleAuthors/1')
    .expect(200)
    .end(done);
  });

  it('should be able to return only one item', function (done) {

    var app = express();
    app.get('/articles/:articleId/authors/:authorId',
            where({
              model: db.ArticleAuthor,
              where: function (req) {
                return {article_id: req.params.articleId};
              },
              index: function (req) {
                return --req.params.authorId;
              },
              key: 'authorId'
            }));

    app.use(function (req, res) {
      expect(req.query.id).to.eql(2);
      res.end('done');
    });

    request(app)
    .get('/articles/1/authors/2')
    .expect(200)
    .end(done);
  });
});


