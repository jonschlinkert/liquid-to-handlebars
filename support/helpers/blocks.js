exports.capture = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.case = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.each = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.form = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.if = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.paginate = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.tablerow = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};

exports.unless = function() {
  var args = [].slice.call(arguments);
  var opts = args.pop();
  return opts.fn(this);
};