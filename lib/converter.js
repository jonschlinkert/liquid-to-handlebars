'use strict';

var extend = require('extend-shallow');
var stripBom = require('strip-bom-string');
var toDoubleQuotes = require('to-double-quotes');
var snapdragon = require('snapdragon');
var compilers = require('./compilers');
var parsers = require('./parsers');

function Converter(options) {
  if (typeof options === 'string') {
    let proto = Object.create(Converter.prototype);
    Converter.call(proto);
    return proto.convert.apply(proto, arguments);
  }
  if (!(this instanceof Converter)) {
    let proto = Object.create(Converter.prototype);
    Converter.call(proto);
    return proto;
  }
  this.options = extend({}, options);
}

Converter.prototype.convert = function(str, options) {
  var ast = this.parse(str, options);
  return this.compile(ast, options);
};

Converter.prototype.convertArgs = function(str, options) {
  var ast = this.parseArgs(str, options);
  return this.compileArgs(ast, options);
};

Converter.prototype.parse = function(str, options) {
  var parser = new snapdragon.Parser(options);
  parser.use(parsers.tags(options));
  return parser.parse(stripBom(str), options);
};

Converter.prototype.parseArgs = function(args, options) {
  var str = toDoubleQuotes(args);
  var parser = new snapdragon.Parser(options);
  parser.use(parsers.args(options));
  return parser.parse(str, options);
};

Converter.prototype.compileArgs = function(ast, options) {
  var compiler = new snapdragon.Compiler(options);
  compiler.use(compilers.args(options));
  var res = compiler.compile(ast, options);
  return res.output;
};

Converter.prototype.compile = function(ast, options) {
  var compiler = new snapdragon.Compiler(options);
  compiler.use(compilers.tags(options));
  var res = compiler.compile(ast, options);
  return res.output;
};

/**
 * Expose `convert`
 */

module.exports = Converter;
