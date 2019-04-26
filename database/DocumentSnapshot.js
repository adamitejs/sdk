const DatabaseDeserializer = require('../core/serialization/DatabaseDeserializer');

class DocumentSnapshot {
  constructor(ref, data) {
    this.ref = DatabaseDeserializer.deserializeDocumentReference(ref);
    this.data = data;
    if (this.data) delete this.data.id;
  }
}

module.exports = DocumentSnapshot;