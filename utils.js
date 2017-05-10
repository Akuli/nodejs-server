// check if two Objects contain the same keys, in any order
function sameKeys(obj1, obj2) {
  return JSON.stringify(Object.keys(obj1).sort())
      == JSON.stringify(Object.keys(obj2).sort());
}


// e.g. startsWith("hello world", "hello")
function startsWith(string, substring) {
  return string.slice(0, substring.length) == substring;
}


// add all keys and values of a source object to a destination object
function update(destination, source) {
  var keys = Object.keys(source);
  for (var i = 0; i < keys.length; i++) {
    destination[keys[i]] = source[keys[i]];
  }
}


exports.sameKeys = sameKeys
exports.startsWith = startsWith
exports.update = update
