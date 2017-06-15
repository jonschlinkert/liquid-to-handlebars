'use strict';

var fs = require('fs');
var path = require('path');
var extract = require('extract-gfm');
var utils = module.exports;

utils.filterExamples = function(str, lang) {
  var blocks = extract.parseBlocks(str).blocks;
  var len = blocks.length;
  var idx = -1;
  var examples = [];

  while (++idx < len) {
    var block = blocks[idx];
    var code = utils.stripRaw(block.code);
    if (utils.hasTemplate(code)) {
      examples.push(utils.toBlock(code, lang));
    }
  }
  return examples;
};

utils.isValidExt = function(name) {
  return name.slice(-3) === '.md' || name.slice(-4) === '.hbs';
};

utils.read = function(cwd, base, name) {
  return fs.readFileSync(path.join(cwd, base, name), 'utf8');
};

utils.helperUtils = function() {
  return `function toString(val) {
  return val != null ? val : '';
}`;
};

utils.toBlockHelper = function(name) {
  return `exports.${name} = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};`;
};

utils.toHelper = function(name) {
  return `exports.${name} = function(val) {
  return toString(val);
};`;
};

utils.hasTemplate = function(str) {
  return /(\{\{[^}]+?\}\}|\{%[^%]+?%\})/.test(str);
};

utils.stripEmptyLines = function(str) {
  var lines = str.split('\n');
  var len = lines.length;
  if (lines[0].trim() === '') {
    lines.shift();
    len--;
  }
  if (lines[len - 1].trim() === '') {
    lines.pop();
  }
  return lines.join('\n');
};

utils.stripRaw = function(code) {
  var str = code.replace(/(\{\{[#\/]|\{%)\s*(end)?raw\s*(%\}|\}\})/g, '');
  return utils.stripEmptyLines(str);
};

utils.toBlock = function(str, lang) {
  return [
    '```' + lang,
    str,
    '```'
  ].join('\n');
};
