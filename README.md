# mongo-object-escape

Mongo cannot store documents that have '$' or '.' in keys.

[The docs](http://docs.mongodb.org/manual/faq/developers/#faq-dollar-sign-escaping) encourage replacing with the Unicode full-width equivalents U+FF04 (i.e. “＄”) and U+FF0E (i.e. “．”).

This library escapes and unescapes the keys of an object according to that convention, returning a new object from each.

See [the tests](./test.js) for examples.

## API

```javascript
var mongoObject = require('mongo-object-escape');
var escapedDocToWrite = mongoObject.escape(userInput);
var unescapedDocToRead = mongoObject.unescape(escapedDocToWrite);
```
