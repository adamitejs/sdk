import { merge } from "lodash";
import AppReference from "./AppReference";
import AdamitePlugin from "./AdamitePlugin";
import { DatabaseReference } from "../database";
import { AuthPlugin } from "../auth";

class App {
  public ref: AppReference;

  public plugins: { [name: string]: AdamitePlugin };

  public config: { [key: string]: any };

  constructor(ref: AppReference) {
    this.ref = ref;
    this.plugins = {};
    this.config = { logLevel: 0 };
  }

  use(plugin: AdamitePlugin) {
    const pluginInstance = new (plugin as any)(this) as AdamitePlugin;
    const pluginName = pluginInstance.getPluginName();
    this.plugins[pluginName] = pluginInstance;
    return this;
  }

  initializeApp(config: any) {
    this.config = merge(this.config, config);
    this.initializePlugins();
    return this;
  }

  plugin(name: string) {
    return this.plugins[name];
  }

  database(name: string = "default"): DatabaseReference {
    if (!this.plugins.database) {
      throw new Error(
        "The database plugin is not enabled on app instance: " + this.ref.name
      );
    }

    return new DatabaseReference(name, this.ref);
  }

  auth(): AuthPlugin {
    if (!this.plugins.auth) {
      throw new Error(
        "The auth plugin is not enabled on app instance: " + this.ref.name
      );
    }

    return this.plugins.auth as AuthPlugin;
  }

  log(plugin: string, message: string) {
    if (this.config.logLevel < 0) return;
    console.log(`⚡ [${plugin}]\t${message}`);
  }

  warn(plugin: string, message: string) {
    if (this.config.logLevel < 1) return;
    console.warn(`⚡ [${plugin}]\t${message}`);
  }

  error(plugin: string, message: string) {
    if (this.config.logLevel < 2) return;
    console.error(`⚡ [${plugin}]\t${message}`);
  }

  private initializePlugins() {
    for (const pluginName in this.plugins) {
      const pluginInstance = this.plugins[pluginName];
      pluginInstance.initialize();
    }
  }

  private static initializeGlobals() {
    const _global = global as any;
    _global.__ADAMITE_APPS__ = _global.__ADAMITE_APPS__ || {};
  }

  static getApp(name: string = "default"): App {
    this.initializeGlobals();
    const _global = global as any;
    _global.__ADAMITE_APPS__[name] =
      _global.__ADAMITE_APPS__[name] || new App(new AppReference(name));
    return _global.__ADAMITE_APPS__[name];
  }
}

export default App;
