import DatabaseSerializer from "../../src/serialization/DatabaseSerializer";
import DatabaseDeserializer from "../../src/serialization/DatabaseDeserializer";
import AppReference from "../../src/app/AppReference";
import DatabaseReference from "../../src/database/DatabaseReference";
import CollectionReference from "../../src/database/CollectionReference";
import DocumentReference from "../../src/database/DocumentReference";

describe("DatabaseDeserializer", () => {
  describe("deserializeDatabaseReference", () => {
    it("should deserialize a DatabaseReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const serializedDatabaseRef = DatabaseSerializer.serializeDatabaseReference(
        databaseRef
      );
      const deserializedDatabaseRef = DatabaseDeserializer.deserializeDatabaseReference(
        serializedDatabaseRef
      );
      expect(deserializedDatabaseRef).toEqual(databaseRef);
    });
  });

  describe("deserializeCollectionReference", () => {
    it("should deserialize a CollectionReference", () => {
      const appRef = new AppReference("default");

      const databaseRef = new DatabaseReference("default", appRef);
      const serializedDatabaseRef = DatabaseSerializer.serializeDatabaseReference(
        databaseRef
      );
      const deserializedDatabaseRef = DatabaseDeserializer.deserializeDatabaseReference(
        serializedDatabaseRef
      );

      const collectionRef = new CollectionReference("users", databaseRef);
      const serializedCollectionRef = DatabaseSerializer.serializeCollectionReference(
        collectionRef
      );
      const deserializedCollectionRef = DatabaseDeserializer.deserializeCollectionReference(
        serializedCollectionRef
      );

      expect(deserializedCollectionRef).toEqual(collectionRef);
      expect(deserializedDatabaseRef).toEqual(databaseRef);
    });
  });

  describe("deserializeDocumentReference", () => {
    it("should deserialize a DocumentReference", () => {
      const appRef = new AppReference("default");

      const databaseRef = new DatabaseReference("default", appRef);

      const collectionRef = new CollectionReference("users", databaseRef);
      const serializedCollectionRef = DatabaseSerializer.serializeCollectionReference(
        collectionRef
      );
      const deserializedCollectionRef = DatabaseDeserializer.deserializeCollectionReference(
        serializedCollectionRef
      );

      const documentRef = new DocumentReference("10", collectionRef);
      const serializedDocumentRef = DatabaseSerializer.serializeDocumentReference(
        documentRef
      );
      const deserializedDocumentRef = DatabaseDeserializer.deserializeDocumentReference(
        serializedDocumentRef
      );

      expect(deserializedCollectionRef).toEqual(collectionRef);
      expect(deserializedDocumentRef).toEqual(documentRef);
    });
  });
});
