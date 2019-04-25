const DocumentReference = require('./DocumentReference');

class CollectionReference {
  constructor(name, database) {
    this.name = name;
    this.database = database;
  }

  doc(id) {
    return new DocumentReference(id, this);
  }
}

module.exports = CollectionReference;