'use strict';

var chai = require('chai');
var expect = chai.expect;

var camelizeKeys = require('../../../lib/utils/camelize-keys');

describe('#camelizeKeys', function () {
  it('should camelize all keys', function () {
    var input = {
      first_name: 'Johny',
      last_name: 'Begood'
    };

    input = camelizeKeys(input);
    expect(input).to.eql({
      firstName: 'Johny',
      lastName: 'Begood'
    });
  });

  it('should work with deep', function () {
    var input = {
      ar: [
        {
          big_test: true
        }
      ],
      foo: { bar_true: true }
    };
    input = camelizeKeys(input);
    expect(input).to.eql({
      ar: [
        {
          bigTest: true
        }
      ],
      foo: { barTrue: true }
    });
  });
});