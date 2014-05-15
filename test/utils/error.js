var expect = require('chai').expect;
var error = require('../../lib/utils/error');

describe('Error util', function () {
  it('should return an error with message and statusCode', function () {
    var err = error('Test message.', 404);
    expect(err).to.be.instanceOf(Error);
    expect(err).to.have.property('message', 'Test message.');
    expect(err).to.have.property('statusCode', 404);
  });

  it('should default statusCode to 400', function () {
    var err = error('Test message.');
    expect(err).to.be.instanceOf(Error);
    expect(err).to.have.property('message', 'Test message.');
    expect(err).to.have.property('statusCode', 400);
  });
});