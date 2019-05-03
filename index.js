const { App } = require("./app");

const app = function(name = "default") {
  return App.getApp(name);
};

app.use = function(plugin) {
  App.addPlugin(plugin.PLUGIN_NAME, function(app) {
    return new plugin(app);
  });
};

module.exports = app;
