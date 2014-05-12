'use strict';

var chai = require('chai');
var expect = chai.expect;

var formatFindQuery = require('../lib/format-find-query');

describe('#formatFindQuery', function() {
  it('should provide default for find query', function () {
    var query = {};
    query = formatFindQuery(query);
    expect(query).to.deep.equal({
      options: {},
      where: {}
    });
  });

  it('should format withRelated correctly', function () {
    var query = {
      withRelated: 'bigTest',
      foo: 'bar'
    };
    query = formatFindQuery(query);
    expect(query).to.deep.equal({
      options: {
        withRelated: ['big_test']
      },
      where: { foo: 'bar' }
    });
  });
});
