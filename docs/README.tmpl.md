# {%= name %} {%= badge("fury") %}

> {%= description %}

## Install
{%= include("install") %}

### Clone Bootstrap

Don't use Bower, use `git clone` since we need to actual HTML docs:

```bash
git clone https://github.com/twbs/bootstrap.git "vendor/bootstrap"
```

Next, run

```bash
node index
```

Converted files will be written to the `./templates` directory.

## Author
{%= contrib("jon") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}