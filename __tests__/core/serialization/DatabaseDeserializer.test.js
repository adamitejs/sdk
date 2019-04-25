const DatabaseSerializer = require('../../../core/serialization/DatabaseSerializer');
const DatabaseDeserializer = require('../../../core/serialization/DatabaseDeserializer');
const AppReference = require('../../../app/AppReference');
const DatabaseReference = require('../../../database/DatabaseReference');
const CollectionReference = require('../../../database/CollectionReference');
const DocumentReference = require('../../../database/DocumentReference');

describe('DatabaseDeserializer', () => {
  describe('deserializeDatabaseReference', () => {
    it('should deserialize a DatabaseReference', () => {
      const appRef = new AppReference('default');
      const databaseRef = new DatabaseReference('default', appRef);
      const serializedDatabaseRef = DatabaseSerializer.serializeDatabaseReference(databaseRef);
      const deserializedDatabaseRef = new DatabaseDeserializer().deserializeDatabaseReference(serializedDatabaseRef);
      expect(deserializedDatabaseRef).toEqual(databaseRef);
    });
  });

  describe('deserializeCollectionReference', () => {
    it('should deserialize a CollectionReference', () => {
      const appRef = new AppReference('default');
      
      const databaseRef = new DatabaseReference('default', appRef);
      const serializedDatabaseRef = DatabaseSerializer.serializeDatabaseReference(databaseRef);
      const deserializedDatabaseRef = new DatabaseDeserializer().deserializeDatabaseReference(serializedDatabaseRef);
      
      const collectionRef = new CollectionReference('users', databaseRef);
      const serializedCollectionRef = DatabaseSerializer.serializeCollectionReference(collectionRef);
      const deserializedCollectionRef = new DatabaseDeserializer().deserializeCollectionReference(serializedCollectionRef);
      
      expect(deserializedCollectionRef).toEqual(collectionRef);
      expect(deserializedDatabaseRef).toEqual(databaseRef);
    });
  });

  describe('deserializeDocumentReference', () => {
    it('should deserialize a DocumentReference', () => {
      const appRef = new AppReference('default');
      
      const databaseRef = new DatabaseReference('default', appRef);

      const collectionRef = new CollectionReference('users', databaseRef);
      const serializedCollectionRef = DatabaseSerializer.serializeCollectionReference(collectionRef);
      const deserializedCollectionRef = new DatabaseDeserializer().deserializeCollectionReference(serializedCollectionRef);

      const documentRef = new DocumentReference('10', collectionRef);
      const serializedDocumentRef = DatabaseSerializer.serializeDocumentReference(documentRef);
      const deserializedDocumentRef = new DatabaseDeserializer().deserializeDocumentReference(serializedDocumentRef);
      
      expect(deserializedCollectionRef).toEqual(collectionRef);
      expect(deserializedDocumentRef).toEqual(documentRef);
    });
  });
});