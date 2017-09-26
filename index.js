'use strict';

var stripBom = require('strip-bom-string');
var snapdragon = require('snapdragon');
var tags = require('./lib/tags');
var args = require('./lib/args');

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
  this.stash = this.options.stash || [];
  this.stack = this.options.stack || [];
  this.variables = [];
}

Converter.prototype.parse = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  var parser = new snapdragon.Parser(opts);
  parser.use(tags.parsers(opts, this));
  return parser.parse(stripBom(str), opts);
};

Converter.prototype.compile = function(ast, options) {
  var opts = Object.assign({}, this.options, options);
  opts.stack = this.stack;
  opts.stash = this.stash;
  var compiler = new snapdragon.Compiler(opts);
  compiler.use(tags.compilers(opts, this));
  compiler.tagNames = [];
  return compiler.compile(ast, opts);
};

Converter.prototype.convert = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  var ast = this.parse(str, opts);
  this.variables = [];
  var res = this.compile(ast, opts);
  return res.output;
};

Converter.prototype.parseArgs = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  var parser = new snapdragon.Parser(opts);
  parser.use(args.parsers(opts, this));
  return parser.parse(str, opts);
};

Converter.prototype.compileArgs = function(ast, options) {
  var opts = Object.assign({}, this.options, options);
  var compiler = new snapdragon.Compiler(opts);
  compiler.use(args.compilers(opts, this));
  var res = compiler.compile(ast, opts);
  return res.output;
};

Converter.prototype.convertArgs = function(str, options) {
  var opts = Object.assign({}, this.options, options);
  var ast = this.parseArgs(str, opts);
  return this.compileArgs(ast, opts);
};

/**
 * Expose `convert`
 */

module.exports = Converter;
