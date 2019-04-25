const DatabaseDeserializer = require('../core/serialization/DatabaseDeserializer');

class DocumentSnapshot {
  constructor(ref, data) {
    this.ref = new DatabaseDeserializer().deserializeDocumentReference(ref);
    this.data = data;
  }
}

module.exports = DocumentSnapshot;