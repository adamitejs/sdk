import { merge } from "lodash";
import AppReference from "./AppReference";
import AdamitePlugin from "./AdamitePlugin";
import { DatabasePlugin } from "../database";
import { AuthPlugin } from "../auth";
import { FunctionsPlugin } from "../functions";

class App {
  public ref: AppReference;

  public plugins: { [name: string]: AdamitePlugin };

  public config: { [key: string]: any };

  constructor(ref: AppReference) {
    this.ref = ref;
    this.plugins = {};
    this.config = { logLevel: 0 };
  }

  use(plugin: { new (app: App): AdamitePlugin }) {
    const pluginInstance = new plugin(this) as AdamitePlugin;
    const pluginName = pluginInstance.getPluginName();
    this.plugins[pluginName] = pluginInstance;
    return this;
  }

  initializeApp(config: any) {
    this.config = merge(this.config, config);
    this.initializePlugins();
    return this;
  }

  disconnect() {
    Object.keys(this.plugins).forEach(pluginId => this.plugins[pluginId].disconnect());
  }

  plugin(name: string) {
    return this.plugins[name];
  }

  database(): DatabasePlugin {
    if (!this.plugins.database) {
      throw new Error("The database plugin is not enabled on app instance: " + this.ref.name);
    }

    return this.plugins.database as DatabasePlugin;
  }

  auth(): AuthPlugin {
    if (!this.plugins.auth) {
      throw new Error("The auth plugin is not enabled on app instance: " + this.ref.name);
    }

    return this.plugins.auth as AuthPlugin;
  }

  functions(): FunctionsPlugin {
    if (!this.plugins.functions) {
      throw new Error("The functions plugin is not enabled on app instance: " + this.ref.name);
    }

    return this.plugins.functions as FunctionsPlugin;
  }

  log(plugin: string, message: string) {
    if (this.config.logLevel < 0) return;
    console.log(`⚡ [${this.ref.name}.${plugin}]\t${message}`);
  }

  warn(plugin: string, message: string) {
    if (this.config.logLevel < 1) return;
    console.warn(`⚡ [${this.ref.name}.${plugin}]\t${message}`);
  }

  error(plugin: string, message: string) {
    if (this.config.logLevel < 2) return;
    console.error(`⚡ [${this.ref.name}.${plugin}]\t${message}`);
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
    _global.__ADAMITE_APPS__[name] = _global.__ADAMITE_APPS__[name] || new App(new AppReference(name));
    return _global.__ADAMITE_APPS__[name];
  }
}

export default App;
