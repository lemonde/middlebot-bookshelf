'use strict';

var chai = require('chai');
var expect = chai.expect;

var formatFindOptions = require('../lib/format-find-options');

describe('#formatFindOptions', function() {
  it('should provide default for find query', function() {
    var input = {};
    formatFindOptions(input);
    expect(input).to.deep.equal({
      options: {},
      where: {id: undefined}
    });
  });

  it('should convert where to an object', function () {
    var input = {
      query: 1
    };
    formatFindOptions(input);
    expect(input.where).to.eql({ id: 1 });
  });

  it('should pick withRelated from where', function () {
    var input = {
      query: {
        withRelated: 'test'
      }
    };
    formatFindOptions(input);
    expect(input.options.withRelated).to.eql('test');
    expect(input.where.withRelated).to.not.exists;
  });
});
