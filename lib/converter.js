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
  var opts = Object.assign({}, this.options, options);
  var ast = this.parseArgs(str, opts);
  return this.compileArgs(ast, opts);
};

Converter.prototype.parse = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  var parser = new snapdragon.Parser(opts);
  parser.use(parsers.tags(opts));
  return parser.parse(stripBom(str), opts);
};

Converter.prototype.parseArgs = function(args, options) {
  var opts = Object.assign({}, this.options, options);
  var str = toDoubleQuotes(args);
  var parser = new snapdragon.Parser(opts);
  parser.use(parsers.args(opts));
  return parser.parse(str, opts);
};

Converter.prototype.compileArgs = function(ast, options) {
  var opts = Object.assign({}, this.options, options);
  var compiler = new snapdragon.Compiler(opts);
  compiler.use(compilers.args(opts));
  var res = compiler.compile(ast, opts);
  return res.output;
};

Converter.prototype.compile = function(ast, options) {
  var opts = Object.assign({}, this.options, options);
  var compiler = new snapdragon.Compiler(opts);
  compiler.use(compilers.tags(opts));
  var res = compiler.compile(ast, opts);
  return res.output;
};

/**
 * Expose `convert`
 */

module.exports = Converter;
