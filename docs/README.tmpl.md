# {%= name %} {%= badge("fury") %}

> {%= description %}

Uses the [delims](https://github.com/jonschlinkert/delims) library to make it super easy to generate regex for replacement patterns.

## Install
{%= include("install") %}

## Usage

Don't expect miracles. For now, coverage is limited to converting Bootstrap's docs templates to handlebars.

```js
var convert = require('liquid-to-handlebars');
var liquid = require('fs').readFileSync('css.html', 'utf8');
var handlebars = convert(liquid);
console.log(handlebars);
```

So replacement patterns for number of tags and filters have not been implemented. Here is the replacement pattern for converting `{{content}}` liquid variables to `{{> body }}` handlebars partials:

```js
pattern: tag.makeVariable('content', {matter: ''}),
replacement: function (match, str) {
  return '{{> body }}';
}
```

Feel free to do a PR to add replacement patterns.


## Example project

If you just want to see how this works, [download the project](https://github.com/jonschlinkert/liquid-to-handlebars/archive/master.zip) or git clone it:

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
Converted files will be written to the `./templates` directory.


## Author
{%= contrib("jon") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}