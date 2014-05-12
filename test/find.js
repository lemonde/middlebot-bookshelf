'use strict';

var chai = require('chai');
var expect = chai.expect;

var Bookshelf = require('bookshelf');
var bookshelf = Bookshelf.initialize({
  client: 'sqlite',
  connection: {
    filename: ':memory:'
  },
  pool: {
    max: 1
  }
});

