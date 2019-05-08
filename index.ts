import { App } from "./src/app";

const app = function(name = "default") {
  return App.getApp(name);
};

app.use = function(plugin: any) {
  App.addPlugin(plugin.PLUGIN_NAME, function(app) {
    return new plugin(app);
  });
};

module.exports = app;
