const DocumentSnapshot = require('./DocumentSnapshot');
const DocumentReference = require('./DocumentReference');

class CollectionSnapshot {
  constructor(ref, docs) {
    this.ref = ref;
    this.docs = docs;
  }

  static fromServerSnapshot(ref, snapshot) {
    return new CollectionSnapshot(
      ref,
      snapshot.docs.map(doc => DocumentSnapshot.fromServerSnapshot(new DocumentReference(doc.id, this), doc))
    );
  }
}

module.exports = CollectionSnapshot;