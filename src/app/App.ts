import { merge } from "lodash";
import AppReference from "./AppReference";
import { PluginInitializer } from "./AppTypes";

class App {
  public ref: AppReference;

  public plugins: any;

  public config: any;

  constructor(ref: AppReference) {
    this.ref = ref;
    this.plugins = {};
  }

  initializeApp(config: any) {
    const DEFAULT_CONFIG = {
      logLevel: 0
    };

    this.config = merge(DEFAULT_CONFIG, config);
    this.initializePlugins();
  }

  initializePlugins() {
    for (const pluginName in App.getPlugins()) {
      const initializePlugin = App.getPlugin(pluginName);
      this.plugins[pluginName] = initializePlugin(this);
    }
  }

  plugin(name: string) {
    return this.plugins[name];
  }

  error(plugin: string, message: string) {
    if (this.config.logLevel < 2) return;
    console.error(`⚡ [${plugin}]\t${message}`);
  }

  warn(plugin: string, message: string) {
    if (this.config.logLevel < 1) return;
    console.warn(`⚡ [${plugin}]\t${message}`);
  }

  log(plugin: string, message: string) {
    if (this.config.logLevel < 0) return;
    console.log(`⚡ [${plugin}]\t${message}`);
  }

  static setGlobals() {
    (global as any).__ARC__ = (global as any).__ARC__ || {
      apps: {},
      plugins: {}
    };
  }

  static addPlugin(name: string, initializer: PluginInitializer) {
    App.setGlobals();
    (global as any).__ARC__.plugins[name] = initializer;
  }

  static getPlugin(name: string) {
    App.setGlobals();
    return (global as any).__ARC__.plugins[name];
  }

  static getPlugins() {
    App.setGlobals();
    return (global as any).__ARC__.plugins;
  }

  static getApps() {
    App.setGlobals();
    return (global as any).__ARC__.apps;
  }

  static getApp(name: string): App {
    App.setGlobals();
    (global as any).__ARC__.apps[name] =
      (global as any).__ARC__.apps[name] || new App(new AppReference(name));
    return (global as any).__ARC__.apps[name];
  }
}

export default App;
