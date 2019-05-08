import DatabaseReference from "../database/DatabaseReference";
import CollectionReference from "../database/CollectionReference";
import DocumentReference from "../database/DocumentReference";
import AppDeserializer from "./AppDeserializer";
import {
  SerializedDatabaseRef,
  SerializedCollectionRef,
  SerializedDocumentRef
} from "./SerializationTypes";

class DatabaseDeserializer {
  static deserializeDatabaseReference(databaseRef: SerializedDatabaseRef) {
    return new DatabaseReference(
      databaseRef.name,
      AppDeserializer.deserializeAppReference(databaseRef.app)
    );
  }

  static deserializeCollectionReference(
    collectionRef: SerializedCollectionRef
  ) {
    const ref = new CollectionReference(
      collectionRef.name,
      DatabaseDeserializer.deserializeDatabaseReference(collectionRef.database)
    );
    ref.query = collectionRef.query;
    return ref;
  }

  static deserializeDocumentReference(documentRef: SerializedDocumentRef) {
    return new DocumentReference(
      documentRef.id,
      DatabaseDeserializer.deserializeCollectionReference(
        documentRef.collection
      )
    );
  }
}

export default DatabaseDeserializer;
