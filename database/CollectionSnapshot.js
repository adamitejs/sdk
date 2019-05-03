const DatabaseDeserializer = require("../core/serialization/DatabaseDeserializer");
const DocumentSnapshot = require("./DocumentSnapshot");

class CollectionSnapshot {
  constructor(ref, docs = []) {
    this.ref = DatabaseDeserializer.deserializeCollectionReference(ref);
    this.docs = docs.map(
      doc => new DocumentSnapshot(DatabaseDeserializer.deserializeDocumentReference(doc.ref), doc.data)
    );
  }

  get id() {
    return this.ref.id;
  }

  mutate(changeType, oldSnapshot, newSnapshot) {
    if (changeType === "create") {
      this._handleCreate(newSnapshot);
    } else if (changeType === "delete") {
      this._handleDelete(oldSnapshot);
    } else if (changeType === "update") {
      this._handleUpdate(newSnapshot, oldSnapshot);
    }

    const mutatedSnapshot = new CollectionSnapshot(this.ref);
    mutatedSnapshot.docs = this.docs;
    return mutatedSnapshot;
  }

  _handleCreate(newSnapshot) {
    this.docs = [...this.docs, newSnapshot];
  }

  _handleDelete(newSnapshot) {
    const index = this.docs.findIndex(snapshot => snapshot.ref.id === newSnapshot.ref.id);
    if (index === -1) return;

    this.docs = [...this.docs.slice(0, index), ...this.docs.slice(index + 1)];
  }

  _handleUpdate(newSnapshot, oldSnapshot) {
    const index = this.docs.findIndex(snapshot => snapshot.ref.id === oldSnapshot.ref.id);
    if (index === -1) return;

    this.docs = [...this.docs.slice(0, index), newSnapshot, ...this.docs.slice(index + 1)];
  }
}

module.exports = CollectionSnapshot;
