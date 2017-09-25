## Deprecation warning ⚠️

The Skeleton theme is no longer being maintained by Shopify.  Developers are encouraged to use [Slate](https://github.com/Shopify/slate) -
a theme scaffolding and command line tool built for developing Shopify themes.

You can continue to use Skeleton; however, this repo will not be kept up-to-date with changes in Shopify theme development.

Skeleton theme
============

The Skeleton theme is a simplified Shopify theme, to be used as a "blank slate" starting point for theme designers.

<b>Features:</b>
- Almost no theme settings. Ready to be customized any way you want.
- Only ~500 lines of CSS including comments.
- Despite its 500 lines of CSS code, it is responsive and has styled drop-down menus.
- Include SVG images to style select elements and cart icon.
- Commented code to teach you Liquid concepts in practice.

<b>Demo:</b>

- [Demo store](http://skeleton.myshopify.com/)

Designing a store for a client? Earn revenue through our <a href="http://www.shopify.com/partners">Partner program<a/>.

Getting started
---------------------
1. <a href="https://github.com/Shopify/skeleton-theme/archive/master.zip">Download</a> the latest version
2. or clone the git repo: <code>git clone https://github.com/Shopify/skeleton-theme.git</code>

Basic structure
---------------
```
├── assets
│   └── Javascript, CSS, and theme images
├── config
│   └── custom Theme Settings
├── layout
│   ├── theme.liquid
│   └── optional alternate layouts
├── snippets
│   └── optional custom code snippets
├── templates
│   ├── 404.liquid
│   ├── article.liquid
│   ├── blog.liquid
│   ├── cart.liquid
│   ├── collection.liquid
│   ├── index.liquid
│   ├── page.liquid
│   ├── product.liquid
│   └── search.liquid
│   └── list-collections.liquid
```

Additional resources
---------------------
- [Themes Documentation][1]: Learn more about Liquid and theme templates.
- [Shopify Theme Kit][2]: A cross-platform command line tool for building Shopify Themes.
- [Liquid Cheat Sheet][3]
- [Retail Tours][4]: Sign up for a workshop in a city near you to learn all things Shopify.
- Need more help? Ask a question in our [Design Forums][5].

[1]: http://help.shopify.com/themes
[2]: ttps://github.com/Shopify/themekit
[3]: https://www.shopify.ca/partners/shopify-cheat-sheet
[4]: https://www.shopify.com/retailtour
[5]: http://ecommerce.shopify.com/c/ecommerce-design
