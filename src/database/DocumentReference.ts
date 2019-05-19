import CollectionReference from "./CollectionReference";
import { DocumentSnapshot } from ".";
import { App } from "../app";
import DatabasePlugin from "./DatabasePlugin";
import { DatabaseSerializer, DatabaseDeserializer } from "../serialization";
import { DocumentSnapshotCallback, StreamChanges, DocumentStreamCallback, StreamOptions } from "./DatabaseTypes";

class DocumentReference {
  public id: string;

  public collection: CollectionReference;

  constructor(id: string, collection: CollectionReference) {
    this.id = id;
    this.collection = collection;
  }

  get hash() {
    return new Buffer(
      `${this.collection.database.name}/${this.collection.database.name}/${this.collection.name}/${this.id}`
    ).toString("base64");
  }

  async get(): Promise<DocumentSnapshot> {
    const app = App.getApp(this.collection.database.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    const { snapshot } = await client.invoke("readDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(this)
    });

    return new DocumentSnapshot(DatabaseDeserializer.deserializeDocumentReference(snapshot.ref), snapshot.data);
  }

  async update(data: any): Promise<DocumentSnapshot> {
    const app = App.getApp(this.collection.database.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    const { snapshot } = await client.invoke("updateDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(this),
      data
    });

    return new DocumentSnapshot(DatabaseDeserializer.deserializeDocumentReference(snapshot.ref), snapshot.data);
  }

  async delete(): Promise<DocumentSnapshot> {
    const app = App.getApp(this.collection.database.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    const { snapshot } = await client.invoke("deleteDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(this)
    });

    return new DocumentSnapshot(DatabaseDeserializer.deserializeDocumentReference(snapshot.ref), snapshot.data);
  }

  async onSnapshot(callback: DocumentSnapshotCallback) {
    const initialSnapshot = await this.get();
    callback(initialSnapshot);

    this.stream(({ changeType, newSnapshot, oldSnapshot }: StreamChanges) => {
      if (!newSnapshot) return;
      callback(newSnapshot, { newSnapshot, oldSnapshot, changeType });
    });
  }

  stream(callback: DocumentStreamCallback) {
    const app = App.getApp(this.collection.database.app.name);
    const database = app.plugins.database as DatabasePlugin;
    database.documentStream(this).register(callback);
  }
}

export default DocumentReference;
