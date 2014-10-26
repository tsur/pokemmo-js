define(['jquery', 'config/init'], function($, settings) {

  console.log(settings);

  return {
    init: function(canvas, container) {
      console.log('init!', canvas, container);
    }
  };
});