'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var handlebars = require('handlebars');
var convert = require('../..');

// test paths
var tests = path.resolve.bind(path, __dirname, '..');
var expected = path.resolve.bind(path, tests('expected'));
var fixtures = path.resolve.bind(path, tests('fixtures'));
var liquid = path.resolve.bind(path, fixtures('liquid'));
var filters = path.resolve.bind(path, liquid('filters'));
var tags = path.resolve.bind(path, liquid('tags'));

exports.read = function(fp) {
  return fs.readFileSync(fp, 'utf8');
};

exports.fixture = function(name) {
  return exports.read(fixtures(name));
};

exports.liquid = function(name) {
  return exports.read(liquid(name));
};

exports.filter = function(name) {
  return exports.fixture(filters(name));
};

exports.tag = function(name) {
  return exports.fixture(tags(name));
};

exports.expected = function(name) {
  return exports.read(expected(name));
};

exports.compile = function(str) {
  return handlebars.compile(str);
};

exports.render = function(str, context) {
  return exports.compile(str)(context);
};

exports.renderFilter = function(name, context) {
  var fn = exports.compile(exports.filter(ame));
  return fn(context);
};
