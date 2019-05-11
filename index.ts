import { App } from "./src/app";

const adamite = function(name = "default"): App {
  return App.getApp(name);
};

export * from "./src/app";
export * from "./src/auth";
export * from "./src/database";
export * from "./src/serialization";

export default adamite;
