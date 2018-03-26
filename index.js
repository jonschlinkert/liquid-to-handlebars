'use strict';

const stripBom = require('strip-bom-string');
const Snapdragon = require('snapdragon');
const tags = require('./lib/tags');
const args = require('./lib/args');

class Converter extends Snapdragon {
  constructor(options) {
    super(options);
    this.stash = this.options.stash || [];
    this.stack = this.options.stack || [];
    this.variables = [];
  }

  parse(str, options) {
    const opts = Object.assign({}, this.options, options);
    this.parser.use(tags.parsers(opts, this));
    return super.parse(stripBom(str), opts);
  }

  compile(ast, options) {
    const opts = Object.assign({}, this.options, options);
    opts.stack = this.stack;
    opts.stash = this.stash;
    this.compiler.use(tags.compilers(opts, this));
    this.compiler.tagNames = [];
    return super.compile(ast, opts);
  }

  convert(str, options) {
    const opts = Object.assign({}, this.options, options);
    const ast = this.parse(str, opts);
    this.variables = [];
    const res = this.compile(ast, opts);
    return res.output;
  }

  parseArgs(str, options) {
    const opts = Object.assign({}, this.options, options);
    const parser = new Snapdragon.Parser(opts);
    parser.use(args.parsers(opts, this));
    return parser.parse(str, opts);
  }

  compileArgs(ast, options) {
    const opts = Object.assign({}, this.options, options);
    const compiler = new Snapdragon.Compiler(opts);
    compiler.use(args.compilers(opts, this));
    const res = compiler.compile(ast, opts);
    return res.output;
  }

  convertArgs(str, options) {
    const opts = Object.assign({}, this.options, options);
    const ast = this.parseArgs(str, opts);
    return this.compileArgs(ast, opts);
  }

  static convert(str, options) {
    const converter = new this(options);
    return converter.convert(str);
  }
}

/**
 * Expose `convert`
 */

module.exports = Converter;
