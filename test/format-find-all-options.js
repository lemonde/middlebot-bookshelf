'use strict';

var chai = require('chai');
var expect = chai.expect;

var formatFindAllOptions = require('../lib/format-find-all-options');

describe('#formatFindAllOptions', function() {
  it('should provide default for findAll query', function () {
    var input = {};
    formatFindAllOptions(input);
    expect(input).to.deep.equal({
      options: {
        sortBy: 'id',
        sortDirection: 'desc',
        limit:20,
        offset:0,
        whereIn: {}
      },
      where: {}
    });
  });

  it('should not override provided parameters', function () {
    var input = {
      options: {
        sortBy:'test',
        sortDirection: 'asc'
      }
    };
    formatFindAllOptions(input);
    expect(input.options.sortBy).to.equal('test');
    expect(input.options.sortDirection).to.equal('asc');
  });

  it('should not convert input if query is a function', function () {
    var input = {
      query: function () {}
    };
    formatFindAllOptions(input);
    expect(input.where).to.be.a('function');
  });

  it('should remove array from where value', function () {
    var input = {
      query: {id: [1, 2]}
    };

    formatFindAllOptions(input);
    expect(input.where).to.be.empty;
    expect(input.options.whereIn).to.eql({id: [1,2]});
  });
});
