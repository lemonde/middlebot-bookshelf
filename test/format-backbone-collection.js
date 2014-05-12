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

var formatBackboneCollection = require('../lib/format-backbone-collection');

describe('#formatBackboneCollection', function () {
  it('should convert collection to JSON', function () {
    var model = new bookshelf.Model({ big_foo: 'bar' });
    var collection = new bookshelf.Collection([model]);

    collection = formatBackboneCollection(collection);
    expect(collection).to.eql([{ bigFoo: 'bar' }]);

  });
});
