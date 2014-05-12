'use strict';

var chai = require('chai');
var expect = chai.expect;

var getWhere = require('../lib/get-check-where');

describe('#getCheckWhere', function () {
  it('should return a where with a string key', function () {
    expect(getWhere(
      'test_key',
      {body: {test_key: 'value'}},
      {}
    )).to.eql({test_key: 'value'});
  });

  it('should return a where with a function key', function() {
    expect(getWhere(
      function (req, res) {
        expect(req).to.eql({body: {test: 'value'}});
        expect(res).to.eql(10);
        return {test: 'value'}
      },
      {body: {test: 'value'}},
      10
    )).to.eql({test: 'value'});
  });

  it('should return a where with an array of string key', function () {
    expect(getWhere(
      ['test_key', 'test_key2'],
      {body: {
        test_key: 'value',
        test_key2: 'value2'
        }
      },
      {}
    )).to.eql({test_key: 'value', test_key2: 'value2'});
  });
});
