# liquid-to-handlebars [![NPM version](https://badge.fury.io/js/liquid-to-handlebars.svg)](http://badge.fury.io/js/liquid-to-handlebars)

> Convert liquid templates to handlebars templates. Quick way to convert - for example - HTML components from Bootstrap's docs into handlebars UI components in a way that makes them actually reusable in node.js projects.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i liquid-to-handlebars --save-dev
```

## Usage

```js
var convert = require('liquid-to-handlebars');

// pass a string of HTML with liquid
console.log(convert('{liquid}'));
```

So replacement patterns for number of tags and filters have not been implemented. Here is the replacement pattern for converting `{{content}}` liquid variables to `{% body %}` layout tags, compatible with [assemble][], [verb][] and any other [template][]-base application.

```js
{
  pattern: tag.makeVariable('content', {matter: ''}),
  replacement: function (match, str) {
    return '{% body %}';
  }
}
```

## Example project

To test drive the example:

```bash
git clone https://github.com/jonschlinkert/liquid-to-handlebars.git
```

Then `cd` into the project and run `npm install`.

**Next, clone Bootstrap**

Don't use Bower, use `git clone` since we need to actual HTML docs:

```bash
git clone https://github.com/twbs/bootstrap.git "vendor/bootstrap"
```

Next, run

```bash
node examples/example
```

Converted files will be written to the `./results` directory.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/liquid-to-handlebars/issues/new)

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on June 30, 2015._