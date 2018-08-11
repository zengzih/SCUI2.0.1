var cooking = require('cooking');
var gen = require('../../build/gen-single-config');

cooking.set(gen(__dirname, 'ElScSelectMultiple'));

module.exports = cooking.resolve();

