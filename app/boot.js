require.config({
  shim: {
    'socketio': {
      exports: 'io'
    },
    'lodash': {
      exports: '_'
    }
  },
  paths: {
    "components": "../vendor",
    "jquery": "../vendor/jquery/dist/jquery"
  }
});

if (!window.requireTestMode) {
  require(['app']);
}