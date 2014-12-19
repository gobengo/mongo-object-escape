var mongoObject = require('./');
var assert = require('chai').assert;

var record = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  your: 'mom',
  'hi.di': 'ho'
};

describe('mongo-object-escape', function () {
  describe('escape', function () {
    it('returns a new object', function () {
      var escaped = mongoObject.escape(record);
      assert(escaped !== record, 'returns a new object');
    });
    it('escapes all the keys', function () {
      var escaped = mongoObject.escape(record);
      assertEscaped(escaped);
    })
    it('escapes all the keys with nested array of objects', function () {
      var bad = { thing: [{ "blah-1.0.0": "hi" }] }
      var escaped = mongoObject.escape(bad);
      assert.ok(Array.isArray(escaped.thing));
      assertEscaped(escaped);
    })
    it('escapes all the keys ob objects in an array', function () {
      var bad = [{ "blah-1.0.0": "hi" }];
      var escaped = mongoObject.escape(bad);
      assert.ok(Array.isArray(escaped));
      assertEscaped(escaped);
    })
    it('escapes an array of strings', function () {
      var bad = ['hi', 'ho'];
      var escaped = mongoObject.escape(bad);
      assert.deepEqual(bad, escaped);
    });
  });
  describe('unescape', function () {
    it('returns a new object', function () {
      var escaped = mongoObject.unescape(record);
      assert(escaped !== record, 'returns a new object');
    });
    it('unescapes', function () {
      var escaped = {
        '\uFF04schema': 'hi',
        '\uFF0Eack': {
          'ack\uFF0E': 'omg'
        }
      };
      assert.deepEqual(mongoObject.unescape(escaped), {
        '$schema': 'hi',
        '.ack': {
          'ack.': 'omg'
        }
      });
    });
  });
  it('escape and unescape cancel each other out', function () {
    var record = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      your: 'mom',
      'hi.di': 'ho',
      hi: null
    };
    assert.deepEqual(record, mongoObject.unescape(mongoObject.escape(record)));
  });
  it('doesn\'t mangle dates', function () {
    var record = {
      now: new Date()
    };
    var escaped = mongoObject.escape(record);
    assert.instanceOf(escaped.now, Date);
    var unescaped = mongoObject.unescape(escaped);
    assert.instanceOf(unescaped.now, Date);
  })
});

function assertEscaped(obj) {
  if (typeof obj !== 'object') {
    return;
  }
  if (Array.isArray(obj)) {
    return obj.map(assertEscaped);
  }
  Object.keys(obj).forEach(function (key) {
    assert.notInclude(key, '.');
    assert.notInclude(key, '$');
    var val = obj[key];
    if (typeof val === 'object') {
      assertEscaped(val);      
    }
  })
}
