define(function() {

  Array.prototype.remove = function(e) {
    var i = 0;
    var arr = this;

    if ((i = arr.indexOf(e)) !== -1) {
      arr.splice(i, 1);
      return true;
    }
    return false;
  };

  Array.prototype.removeLast = function(e) {
    var i = 0;
    var arr = this;

    if ((i = arr.lastIndexOf(e)) !== -1) {
      arr.splice(i, 1);
      return true;
    }
    return false;
  };

});