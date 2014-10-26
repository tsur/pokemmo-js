define(function() {

  var Logger = function Logger() {};

  Logger.log = function(obj) {
    console.log(obj);
  };

  return Logger;
});