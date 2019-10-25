import DatabaseReference from "../database/DatabaseReference";
import AppSerializer from "./AppSerializer";
import CollectionReference from "../database/CollectionReference";
import DocumentReference from "../database/DocumentReference";
import { SerializedDatabaseRef, SerializedCollectionRef, SerializedDocumentRef } from "./SerializationTypes";

class DatabaseSerializer {
  static serializeDatabaseReference(databaseRef: DatabaseReference): SerializedDatabaseRef {
    return {
      type: "DatabaseReference",
      name: databaseRef.name,
      app: AppSerializer.serializeAppReference(databaseRef.app)
    };
  }

  static serializeCollectionReference(collectionRef: CollectionReference): SerializedCollectionRef {
    return {
      type: "CollectionReference",
      name: collectionRef.name,
      query: collectionRef.query,
      joins: collectionRef.joins.map(join => ({
        field: join.field,
        collectionRef: this.serializeCollectionReference(join.collectionRef)
      })),
      database: DatabaseSerializer.serializeDatabaseReference(collectionRef.database)
    };
  }

  static serializeDocumentReference(documentRef: DocumentReference): SerializedDocumentRef {
    return {
      type: "DocumentReference",
      id: documentRef.id,
      collection: DatabaseSerializer.serializeCollectionReference(documentRef.collection),
      joins: documentRef.joins.map(join => ({
        field: join.field,
        collectionRef: this.serializeCollectionReference(join.collectionRef)
      }))
    };
  }
}

export default DatabaseSerializer;
