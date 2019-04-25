const AppSerializer = require('./AppSerializer');

class DatabaseSerializer {
  static serializeDatabaseReference(databaseRef) {
    return {
      type: 'DatabaseReference',
      name: databaseRef.name,
      app: AppSerializer.serializeAppReference(databaseRef.app)
    };
  }

  static serializeCollectionReference(collectionRef) {
    return {
      type: 'CollectionReference',
      name: collectionRef.name,
      database: DatabaseSerializer.serializeDatabaseReference(collectionRef.database)
    };
  }

  static serializeDocumentReference(documentRef) {
    return {
      type: 'DocumentReference',
      id: documentRef.id,
      collection: DatabaseSerializer.serializeCollectionReference(documentRef.collection)
    };
  }
}

module.exports = DatabaseSerializer;