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
      'hi.di': 'ho'
    };
    assert.deepEqual(record, mongoObject.unescape(mongoObject.escape(record)));
  });
});

function assertEscaped(obj) {
  Object.keys(obj).forEach(function (key) {
    assert.notInclude(key, '.');
    assert.notInclude(key, '$');
    var val = obj[key];
    if (typeof val === 'object') {
      assertEscaped(val);      
    }
  })
}
