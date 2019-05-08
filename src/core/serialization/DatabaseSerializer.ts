import DatabaseReference from "../../database/DatabaseReference";
import AppSerializer from "./AppSerializer";
import CollectionReference from "../../database/CollectionReference";
import DocumentReference from "../../database/DocumentReference";
import {
  SerializedDatabaseRef,
  SerializedCollectionRef,
  SerializedDocumentRef
} from "./SerializationTypes";

class DatabaseSerializer {
  static serializeDatabaseReference(
    databaseRef: DatabaseReference
  ): SerializedDatabaseRef {
    return {
      type: "DatabaseReference",
      name: databaseRef.name,
      app: AppSerializer.serializeAppReference(databaseRef.app)
    };
  }

  static serializeCollectionReference(
    collectionRef: CollectionReference
  ): SerializedCollectionRef {
    return {
      type: "CollectionReference",
      name: collectionRef.name,
      query: collectionRef.query,
      database: DatabaseSerializer.serializeDatabaseReference(
        collectionRef.database
      )
    };
  }

  static serializeDocumentReference(
    documentRef: DocumentReference
  ): SerializedDocumentRef {
    return {
      type: "DocumentReference",
      id: documentRef.id,
      collection: DatabaseSerializer.serializeCollectionReference(
        documentRef.collection
      )
    };
  }
}

export default DatabaseSerializer;
