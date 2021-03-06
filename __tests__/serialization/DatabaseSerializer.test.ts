import AppSerializer from "../../src/serialization/AppSerializer";
import DatabaseSerializer from "../../src/serialization/DatabaseSerializer";
import AppReference from "../../src/app/AppReference";
import DatabaseReference from "../../src/database/DatabaseReference";
import CollectionReference from "../../src/database/CollectionReference";
import DocumentReference from "../../src/database/DocumentReference";

describe("DatabaseSerializer", () => {
  describe("serializeDatabaseReference", () => {
    it("should serialize a CollectionReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const serializedAppRef = AppSerializer.serializeAppReference(appRef);
      const serializedDatabaseRef = DatabaseSerializer.serializeDatabaseReference(
        databaseRef
      );
      expect(serializedDatabaseRef.name).toBe("default");
      expect(serializedDatabaseRef.app).toEqual(serializedAppRef);
    });
  });

  describe("serializeCollectionReference", () => {
    it("should serialize a CollectionReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const collectionRef = new CollectionReference("users", databaseRef);
      const serializedDatabaseRef = DatabaseSerializer.serializeDatabaseReference(
        databaseRef
      );
      const serializedCollectionReference = DatabaseSerializer.serializeCollectionReference(
        collectionRef
      );
      expect(serializedCollectionReference.name).toBe("users");
      expect(serializedCollectionReference.type).toBe("CollectionReference");
      expect(serializedCollectionReference.database).toEqual(
        serializedDatabaseRef
      );
    });
  });

  describe("serializeDocumentReference", () => {
    it("should serialize a DocumentReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const collectionRef = new CollectionReference("users", databaseRef);
      const documentRef = new DocumentReference("10", collectionRef);
      const serializedCollectionReference = DatabaseSerializer.serializeCollectionReference(
        collectionRef
      );
      const serializedDocumentReference = DatabaseSerializer.serializeDocumentReference(
        documentRef
      );
      expect(serializedDocumentReference.id).toBe("10");
      expect(serializedDocumentReference.collection).toEqual(
        serializedCollectionReference
      );
      expect(serializedDocumentReference.type).toBe("DocumentReference");
    });
  });
});
