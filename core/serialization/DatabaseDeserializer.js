class DatabaseDeserializer {}
module.exports = DatabaseDeserializer;

const AppDeserializer = require('../serialization/AppDeserializer');
const DatabaseReference = require('../../database/DatabaseReference');
const CollectionReference = require('../../database/CollectionReference');
const DocumentReference = require('../../database/DocumentReference');

DatabaseDeserializer.prototype.deserializeDatabaseReference = function (databaseRef) {
  return new DatabaseReference(databaseRef.name, AppDeserializer.deserializeAppReference(databaseRef.app));
}

DatabaseDeserializer.prototype.deserializeCollectionReference = function (collectionRef) {
  return new CollectionReference(collectionRef.name, DatabaseDeserializer.prototype.deserializeDatabaseReference(collectionRef.database));
}

DatabaseDeserializer.prototype.deserializeDocumentReference = function (documentRef) {
  return new DocumentReference(documentRef.id, DatabaseDeserializer.prototype.deserializeCollectionReference(documentRef.collection));
}