const _ = require('lodash');
const AppReference = require('./AppReference');
const ServiceReference = require('./ServiceReference');

class App {
  constructor(ref) {
    this.ref = ref;
    this.services = {};
  }

  initializeApp(config) {
    const DEFAULT_CONFIG = {
      logLevel: 0
    };

    this.config = _.merge(DEFAULT_CONFIG, config);
    this.initializeServices();
  }

  initializeServices() {
    for (const serviceName in App.getServices()) {
      const initializeService = App.getService(serviceName);
      this.services[serviceName] = initializeService(this);
    }
  }

  service(name) {
    return this.services[name];
  }

  error(service, message) {
    if (this.config.logLevel < 2) return;
    console.error(`⚡ [${service}]\t${message}`);
  }
  
  warn(service, message) {
    if (this.config.logLevel < 1) return;
    console.warn(`⚡ [${service}]\t${message}`);
  }

  log(service, message) {
    if (this.config.logLevel < 0) return;
    console.log(`⚡ [${service}]\t${message}`);
  }

  static setGlobals() {
    global.__ARC__ = global.__ARC__ || {
      apps: {},
      services: {}
    };
  }

  static addService(name, initializer) {
    App.setGlobals();
    global.__ARC__.services[name] = initializer;
  }

  static getService(name) {
    App.setGlobals();
    return global.__ARC__.services[name];
  }

  static getServices() {
    App.setGlobals();
    return global.__ARC__.services;
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