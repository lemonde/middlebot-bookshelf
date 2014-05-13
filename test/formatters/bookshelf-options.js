'use strict';

var expect = require('chai').expect;
var bkOptsFormatter = require('../../lib/formatters/bookshelf-options');

describe('Bookshelf options formatter', function () {
  it('should format options', function () {
    expect(bkOptsFormatter(['foo'], { foo: 'bar' }, { foo: 'test' })).to.eql({ foo: 'bar' });
  });

  it('should format withRelated correctly', function () {
    expect(bkOptsFormatter(['withRelated'], { withRelated: ['bigTest'] }))
    .to.eql({ withRelated: ['big_test'] });
  });

  it('should format sortBy', function () {
    expect(bkOptsFormatter(['sortBy'], { sortBy: 'bigTest' }))
    .to.eql({ sortBy: 'big_test' });
  });
});