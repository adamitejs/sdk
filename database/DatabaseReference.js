const CollectionReference = require("./CollectionReference");

class DatabaseReference {
  constructor(name, app) {
    this.name = name;
    this.app = app;
  }

  collection(name) {
    return new CollectionReference(name, this);
  }
}

module.exports = DatabaseReference;
