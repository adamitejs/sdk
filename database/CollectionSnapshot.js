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

  handleSubscriptionUpdate(changeType, newSnapshot, oldSnapshot) {
    if (changeType === 'create') {
      this._handleCreate(newSnapshot);
    } else if (changeType === 'delete') {
      this._handleDelete(oldSnapshot);
    } else if (changeType === 'update') {
      this._handleUpdate(newSnapshot, oldSnapshot);
    }
  }  

  _handleCreate(newSnapshot) {
    this.docs.push(newSnapshot);
  }

  _handleDelete(newSnapshot) {
    const docs = this.docs;
    for(var i = docs.length - 1; i >= 0; i--) {
      if (docs[i].ref.id === newSnapshot.ref.id) {
        docs.splice(i, 1);
        return;
      }
    }
    console.error("[CollectionSnapshot]: Attempted to delete snapshot of document which is not present in collection snapshot.");
  }

  _handleUpdate(newSnapshot, oldSnapshot) {
    const docs = this.docs;
    for(var i = docs.length - 1; i >= 0; i--) {
      if (docs[i].ref.id === oldSnapshot.ref.id) {
        docs[i] = newSnapshot;
        return;
      }
    }
    console.error("[CollectionSnapshot]: Attempted to update snapshot of document which is not present in collection snapshot.");
  }
}

module.exports = CollectionSnapshot;