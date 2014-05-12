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

var backboneFormatter = require('../../lib/formatters/backbone');

describe('#formatBackboneModel', function () {
  it('should convert model to JSON', function () {
    var model = new bookshelf.Model({ big_foo: 'bar' });

    model = backboneFormatter.formatModel(model);
    expect(model).to.eql({ bigFoo: 'bar' });
  });
});

describe('#formatBackboneCollection', function () {
  it('should convert collection to JSON', function () {
    var model = new bookshelf.Model({ big_foo: 'bar' });
    var collection = new bookshelf.Collection([model]);

    collection = backboneFormatter.formatCollection(collection);
    expect(collection).to.eql([{ bigFoo: 'bar' }]);

  });
});