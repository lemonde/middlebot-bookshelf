'use strict';

var expect = require('chai').expect;
var whereRawFormatter = require('../../../lib/formatters/where-raw');

describe('Where formatter', function () {
  it('should format where', function () {
    expect(whereRawFormatter(['opt'], { bigTest: 'foo', opt: false })).to.eql('');
  });

  it('should format where options json', function () {
    expect(whereRawFormatter(['opt'], { bigTest: 'foo', opt: false, 'data.team': 'PSG' }, ['data'])).to.eql("data->>'team' = 'PSG'");
  });
});
