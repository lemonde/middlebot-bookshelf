'use strict';

var chai = require('chai');
var expect = chai.expect;

var snakeCaseKeys = require('../../../lib/utils/snake-case-keys');

describe('#snakeCaseKeys', function() {
  it('should convert camel-case keys to snake case', function() {
    var input = {
      testData : 1,
      AnotherTestData : 'test'
    };

    input = snakeCaseKeys(input);
    expect(input.testData).to.not.exists;
    expect(input.AnotherTestData).to.not.exists;
    expect(input.test_data).to.exists;
    expect(input.another_test_data).to.exists;
  });

  it('should work with deep', function () {

    var input = {
      ar: [
        {
          bigTest: true
        }
      ],
      foo: { barTrue: true }
    };

    input = snakeCaseKeys(input);
    expect(input).to.eql({
      ar: [
        {
          big_test: true
        }
      ],
      foo: { bar_true: true }
    });
  });
});