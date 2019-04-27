const AppDeserializer = require('../serialization/AppDeserializer');
const DatabaseReference = require('../../database/DatabaseReference');
const CollectionReference = require('../../database/CollectionReference');
const DocumentReference = require('../../database/DocumentReference');

class DatabaseDeserializer {
  static deserializeDatabaseReference(databaseRef) {
    return new DatabaseReference(databaseRef.name, AppDeserializer.deserializeAppReference(databaseRef.app));
  }

  static deserializeCollectionReference(collectionRef) {
    const ref = new CollectionReference(collectionRef.name, DatabaseDeserializer.deserializeDatabaseReference(collectionRef.database));
    ref._limit = collectionRef.limit || ref._limit;
    ref._orderBy = collectionRef.orderBy || ref._orderBy;
    ref._wheres = collectionRef.wheres || ref._wheres;
    return ref;
  }

  static deserializeDocumentReference(documentRef) {
    return new DocumentReference(documentRef.id, DatabaseDeserializer.deserializeCollectionReference(documentRef.collection));
  }
}

module.exports = DatabaseDeserializer;


