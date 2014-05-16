'use strict';

var expect = require('chai').expect;
var bkOptsFormatter = require('../../../lib/formatters/bookshelf-options');

describe('Bookshelf options formatter', function () {
  it('should format options', function () {
    expect(bkOptsFormatter(['foo'], { foo: 'bar' }, { foo: 'test' })).to.eql({ foo: 'bar' });
  });

  it('should format sortBy', function () {
    expect(bkOptsFormatter(['sortBy'], { sortBy: 'bigTest', foo: 'bar' }))
    .to.eql({ sortBy: 'big_test' });
  });

  it('should format limit', function () {
    expect(bkOptsFormatter(['limit'], { limit: '1'}))
    .to.eql({ limit: 1});
  });

  it('should format offset', function () {
    expect(bkOptsFormatter(['offset'], { offset: '1'}))
    .to.eql({ offset: 1});
  });

});
