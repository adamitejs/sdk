import { App } from "./src/app";

const adamite = function(name = "default"): App {
  return App.getApp(name);
};

adamite.use = function(plugin: any) {
  App.addPlugin(plugin.PLUGIN_NAME, function(app) {
    return new plugin(app);
  });
};

export * from "./src/app";
export * from "./src/auth";
export * from "./src/database";
export * from "./src/serialization";

export { adamite };
