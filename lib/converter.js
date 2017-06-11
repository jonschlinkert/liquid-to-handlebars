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
  this.options = options || {};
  this.stack = this.options.stack || [];
}

Converter.prototype.convert = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  var ast = this.parse(str, opts);
  return this.compile(ast, opts);
};

Converter.prototype.convertArgs = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  var ast = this.parseArgs(str, opts);
  return this.compileArgs(ast, opts);
};

Converter.prototype.parse = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  var parser = new snapdragon.Parser(opts);
  parser.use(parsers.tags(opts));
  return parser.parse(stripBom(str), opts);
};

Converter.prototype.parseArgs = function(args, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  var str = toDoubleQuotes(args);
  var parser = new snapdragon.Parser(opts);
  parser.use(parsers.args(opts));
  return parser.parse(str, opts);
};

Converter.prototype.compileArgs = function(ast, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  var compiler = new snapdragon.Compiler(opts);
  compiler.use(compilers.args(opts));
  var res = compiler.compile(ast, opts);
  return res.output;
};

Converter.prototype.compile = function(ast, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  var compiler = new snapdragon.Compiler(opts);
  compiler.use(compilers.tags(opts));
  var res = compiler.compile(ast, opts);
  return res.output;
};

/**
 * Expose `convert`
 */

module.exports = Converter;
