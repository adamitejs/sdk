import CollectionReference from "./CollectionReference";
import { DocumentSnapshot } from ".";
import { App } from "../app";
import DatabasePlugin from "./DatabasePlugin";
import { DatabaseSerializer, DatabaseDeserializer } from "../serialization";
import { DocumentSnapshotCallback, StreamChanges, DocumentStreamCallback, UpdateOptions } from "./DatabaseTypes";
import { Buffer } from "buffer";

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

  async update(data: any, options?: UpdateOptions): Promise<DocumentSnapshot> {
    const app = App.getApp(this.collection.database.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    const { snapshot } = await client.invoke("updateDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(this),
      data,
      options
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

  onSnapshot(callback: DocumentSnapshotCallback): () => void {
    this.sendInitialSnapshot(callback);

    return this.stream(({ changeType, newSnapshot, oldSnapshot }: StreamChanges) => {
      if (!newSnapshot) return;
      callback(newSnapshot, { newSnapshot, oldSnapshot, changeType });
    });
  }

  stream(callback: DocumentStreamCallback): () => void {
    const app = App.getApp(this.collection.database.app.name);
    const database = app.plugins.database as DatabasePlugin;
    database.documentStream(this).register(callback);

    return () => {
      database.documentStream(this).unregister(callback);
    };
  }

  private async sendInitialSnapshot(callback: DocumentSnapshotCallback) {
    const initialSnapshot = await this.get();
    callback(initialSnapshot);
  }
}

export default DocumentReference;
