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

var formatBackboneModel = require('../lib/format-backbone-model');

describe('#formatBackboneModel', function () {
  it('should convert model to JSON', function () {
    var model = new bookshelf.Model({ big_foo: 'bar' });

    model = formatBackboneModel(model);
    expect(model).to.eql({ bigFoo: 'bar' });
  });
});
