'use strict';

var nconf = require('nconf');
var path = require('path');
var Errors = require('node-error');

//set up an nconf instance with the error messages
var config = new nconf.Provider();
var configDir = path.resolve(__dirname, '../..', 'config');
config.file(path.resolve(configDir, 'errors.json'));

//instantiate and expose an error manager
var errors = module.exports = Errors(config);

