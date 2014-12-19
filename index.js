var mongoKey = require('mongo-key-escape');

exports.escape = function (obj) {
    return rewriteObjKeys(mongoKey.escape, obj);
};

exports.unescape = function (obj) {
    return rewriteObjKeys(mongoKey.unescape, obj);
};

function rewriteObjKeys(rewriteKey, obj) {
  var escaped = obj;
  if (Array.isArray(obj)) {
    escaped = obj.map(function (d) {
      return rewriteObjKeys(rewriteKey, d);
    });
  } else if (shouldEscapeVal(obj)) {
    escaped = Object.keys(obj).reduce(function (escaped, key) {
      var val = obj[key];
      var escapedKey = rewriteKey(key);
      if ( ! shouldEscapeVal(val)) {
        escaped[escapedKey] = val;
      } else {
        escaped[escapedKey] = rewriteObjKeys(rewriteKey, val);
      }
      return escaped;
    }, {});
  }
  return escaped;
}

function shouldEscapeVal(val) {
  return val !== null
      && typeof val === 'object'
      && ! (val instanceof Date)
}
