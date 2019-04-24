class ServiceReference {
  constructor(name, app) {
    this.name = name;
    this.app = app;
  }

  get path() {
    return [
      this.app.path,
      this.name
    ].join('/');
  }
}

module.exports = ServiceReference;