var expect = require('chai').expect;
var error = require('../../lib/utils/error');

describe('Error util', function () {
  it('should return an error with message and statusCode', function () {
    var err = error('Test message.', 400);
    expect(err).to.be.instanceOf(Error);
    expect(err).to.have.property('message', 'Test message.');
    expect(err).to.have.property('statusCode', 400);
  });
});