'use strict';

var stripBom = require('strip-bom-string');
var toDoubleQuotes = require('to-double-quotes');
var snapdragon = require('snapdragon');
var compilers = require('./compilers');
var parsers = require('./parsers');

function converter(str, options) {
  var ast = converter.parse(str, options);
  return converter.compile(ast, options);
}

converter.convertArgs = function(str, options) {
  var ast = converter.parseArgs(str, options);
  return converter.compileArgs(ast, options);
};

converter.parseArgs = function(args, options) {
  var str = toDoubleQuotes(args);
  var parser = new snapdragon.Parser(options);
  parser.use(parsers.args(options));
  var ast = parser.parse(str, options);
  // console.log(ast)
  return ast;
};

converter.parse = function(str, options) {
  var parser = new snapdragon.Parser(options);
  parser.use(parsers.tags(options));
  return parser.parse(stripBom(str), options);
};

converter.compileArgs = function(ast, options) {
  var compiler = new snapdragon.Compiler(options);
  compiler.use(compilers.args(options));
  var res = compiler.compile(ast, options);
  return res.output;
};

converter.compile = function(ast, options) {
  var compiler = new snapdragon.Compiler(options);
  compiler.use(compilers.tags(options));
  var res = compiler.compile(ast, options);
  return res.output;
};

/**
 * Expose `convert`
 */

module.exports = converter;
