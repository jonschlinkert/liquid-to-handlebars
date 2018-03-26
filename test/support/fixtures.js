const fs = require('fs');
const path = require('path');
const glob = require('glob');
const write = require('write');
const converter = require('../..');

module.exports = fixtures;

function fixtures(pattern, destBase, options) {
  const opts = Object.assign({cwd: process.cwd()}, options);
  const files = glob.sync(pattern, opts);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fp = path.resolve(opts.cwd, file);

    const dest = path.resolve(destBase, file);
    const str = fs.readFileSync(fp, 'utf8');
    dest = dest.replace(/\.liquid$/, '.hbs');
    write.sync(dest, converter.convert(str));
  }
};

fixtures('shopify-*/**/*.{*liquid*,json}', 'test/expected', {
  cwd: path.join(__dirname, '../fixtures')
});
