const Base64URL = require('base64-url');

function toCursor({ value }) {
  return Base64URL.encode(value.toString());
}

function fromCursor(string) {
  const value = Base64URL.decode(string);
  if (value) {
    return { value };
  } else {
    return null;
  }
}

module.exports = {
  toCursor,
  fromCursor
};
