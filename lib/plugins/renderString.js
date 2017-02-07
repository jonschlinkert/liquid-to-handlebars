'use strict';

module.exports = function renderString() {
  var count = 0;
  return function() {

    this.renderString = function(str, locals, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }
      var view = this.view(('temp' + count++), {content: str});
      if (typeof view.engine === 'undefined' && locals.context && locals.context.ext) {
        view.engine = locals.context.ext;
      }
      this.render(view, locals, function(err, res) {
        if (err) {
          err.locals = locals;
          err.view = view;
          cb(err);
          return;
        }
        cb(null, res.content);
      });
    };
  };
};
