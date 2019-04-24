const ServiceReference = require('./ServiceReference');

class AppReference {
  constructor(name) {
    this.name = name;
  }

  get path() {
    return '/' + this.name;
  }

  service(name) {
    return new ServiceReference(name, this);
  }
}

module.exports = AppReference;