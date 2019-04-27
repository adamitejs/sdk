const DatabaseDeserializer = require('../core/serialization/DatabaseDeserializer');
const DocumentSnapshot = require('./DocumentSnapshot');

class CollectionSnapshot {
  constructor(ref, docs = []) {
    this.ref = DatabaseDeserializer.deserializeCollectionReference(ref);
    this.docs = docs.map(doc => new DocumentSnapshot(DatabaseDeserializer.deserializeDocumentReference(doc.ref), doc.data));
  }

  get id() {
    return this.ref.id;
  }

  handleSubscriptionUpdate(newSnapshot, oldSnapshot) {
    if (newSnapshot && !oldSnapshot) {
      this._handleCreate(newSnapshot);
    } else if (!newSnapshot && oldSnapshot) {
      this._handleDelete(oldSnapshot);
    } else {
      this._handleUpdate(newSnapshot, oldSnapshot);
    }
  }  

  _handleCreate(newSnapshot) {
    this.docs = [...this.docs, newSnapshot];
  }

  _handleDelete(newSnapshot) {
    this.docs = this.docs.filter(snapshot => snapshot.ref.id !== newSnapshot.ref.id);
  }

  _handleUpdate(newSnapshot, oldSnapshot) {
    this.docs = this.docs.map(snapshot => snapshot.ref.id === oldSnapshot.ref.id ? newSnapshot : snapshot);
  }
}

module.exports = CollectionSnapshot;