'use strict';

module.exports = function(options) {
  return function(app) {

    app.define('relatedList', function(name) {
      var collection = app[name];
      if (!collection) {
        throw new Error(`collection ${name} does not exist`);
      }

      var keys = Object.keys(collection.views);
      var related = [];

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var view = collection.views[key];
        var item = new Item(view);
        related.push(item);
      }

      return related;
    });
  };
};

function Item(view) {
  this.url = view.relative;
  this.path = view.path;
  this.date = view.data.date;
  this.data = view.data.page;
  this.title = this.data.title;
}
