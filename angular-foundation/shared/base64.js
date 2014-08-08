angular.module('base64', [])

  .factory('base64Decode', function() {
    return function(text) {
      return base64codec.decode(text);
    }
  })

  .factory('base64Encode', function() {
    return function(text) {
      return base64codec.encode(text);
    }
  });
