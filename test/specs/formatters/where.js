'use strict';

var expect = require('chai').expect;
var whereFormatter = require('../../../lib/formatters/where');

describe('Where formatter', function () {
  it('should format where', function () {
    expect(whereFormatter(['opt'], { bigTest: 'foo', opt: false })).to.eql({ big_test: 'foo' });
  });

  it('should format where options json', function () {
    expect(whereFormatter(['opt'], { bigTest: 'foo', opt: false, 'data.team': 'PSG' }, ['data'])).to.eql({ big_test: 'foo' });
  });
});
