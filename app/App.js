const _ = require('lodash');
const AppReference = require('./AppReference');

class App {
  constructor(ref) {
    this.ref = ref;
    this.plugins = {};
  }

  initializeApp(config) {
    const DEFAULT_CONFIG = {
      logLevel: 0
    };

    this.config = _.merge(DEFAULT_CONFIG, config);
    this.initializePlugins();
  }

  initializePlugins() {
    for (const pluginName in App.getPlugins()) {
      const initializePlugin = App.getPlugin(pluginName);
      this.plugins[pluginName] = initializePlugin(this);
    }
  }

  plugin(name) {
    return this.plugins[name];
  }

  error(plugin, message) {
    if (this.config.logLevel < 2) return;
    console.error(`⚡ [${plugin}]\t${message}`);
  }
  
  warn(plugin, message) {
    if (this.config.logLevel < 1) return;
    console.warn(`⚡ [${plugin}]\t${message}`);
  }

  log(plugin, message) {
    if (this.config.logLevel < 0) return;
    console.log(`⚡ [${plugin}]\t${message}`);
  }

  static setGlobals() {
    global.__ARC__ = global.__ARC__ || {
      apps: {},
      plugins: {}
    };
  }

  static addPlugin(name, initializer) {
    App.setGlobals();
    global.__ARC__.plugins[name] = initializer;
  }

  static getPlugin(name) {
    App.setGlobals();
    return global.__ARC__.plugins[name];
  }

  static getPlugins() {
    App.setGlobals();
    return global.__ARC__.plugins;
  }

  static getApps() {
    App.setGlobals();
    return global.__ARC__.apps;
  }

  static getApp(name) {
    App.setGlobals();
    global.__ARC__.apps[name] = global.__ARC__.apps[name] || new App(new AppReference(name));
    return global.__ARC__.apps[name];
  }
}

module.exports = App;