// check if two Objects contain the same keys, in any order
exports.sameKeys = function(obj1, obj2) {
  return JSON.stringify(Object.keys(obj1).sort())
      == JSON.stringify(Object.keys(obj2).sort());
}

// e.g. startsWith("hello world", "hello")
exports.startsWith = function(string, substring) {
  return string.slice(0, substring.length) == substring;
}


// add all keys and values of a source object to a destination object
exports.mappingUpdate = function(destination, source) {
  Object.keys(source).forEach(function(key) {
    destination[key] = source[key];
  });
}
