import DocumentReference from "./DocumentReference";
import DatabaseReference from "./DatabaseReference";
import {
  CollectionQuery,
  CollectionSnapshotCallback,
  StreamChanges,
  CollectionStreamCallback,
  CollectionWhereComparision
} from "./DatabaseTypes";
import CollectionSnapshot from "./CollectionSnapshot";
import { DocumentSnapshot, DatabasePlugin } from ".";
import { DatabaseSerializer, DatabaseDeserializer } from "../serialization";
import { App } from "../app";
import { Buffer } from "buffer";

class CollectionReference {
  public name: string;

  public database: DatabaseReference;

  public query: CollectionQuery;

  private snapshot: CollectionSnapshot | undefined;

  constructor(name: string, database: DatabaseReference) {
    this.name = name;
    this.database = database;
    this.query = { limit: 1000, orderBy: [], where: [] };
  }

  get hash() {
    return new Buffer(
      `${this.database.app.name}/${this.database.name}/${this.name}?q=${encodeURIComponent(JSON.stringify(this.query))}`
    ).toString("base64");
  }

  doc(id: string) {
    return new DocumentReference(id, this);
  }

  limit(limit: number) {
    this.query.limit = limit;
    return this;
  }

  orderBy(field: string, direction: string = "asc") {
    this.query.orderBy.push([field, direction]);
    return this;
  }

  where(field: string, operator: CollectionWhereComparision, value: any) {
    this.query.where.push([field, operator, value]);
    return this;
  }

  async create(data: any): Promise<DocumentSnapshot> {
    const app = App.getApp(this.database.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    if (!client) {
      throw new Error("The database plugin is not enabled on app instance: " + app.ref.name);
    }

    const { snapshot } = await client.invoke("createDocument", {
      ref: DatabaseSerializer.serializeCollectionReference(this),
      data
    });

    return new DocumentSnapshot(DatabaseDeserializer.deserializeDocumentReference(snapshot.ref), snapshot.data);
  }

  async get(): Promise<CollectionSnapshot> {
    const app = App.getApp(this.database.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    if (!client) {
      throw new Error("The database plugin is not enabled on app instance: " + app.ref.name);
    }

    const { snapshot } = await client.invoke("readCollection", {
      ref: DatabaseSerializer.serializeCollectionReference(this)
    });

    return new CollectionSnapshot(snapshot.ref, snapshot.data);
  }

  onSnapshot(callback: CollectionSnapshotCallback): () => void {
    this.sendInitialSnapshot(callback);

    return this.stream(
      ({ changeType, oldSnapshot, newSnapshot }: StreamChanges) => {
        // create the in-memory snapshot if needed
        this.snapshot = this.snapshot || new CollectionSnapshot(this);

        // mutate the in-memory snapshot, and send it in the callback
        this.snapshot = this.snapshot.mutate(changeType, oldSnapshot, newSnapshot);
        callback(this.snapshot, { newSnapshot, oldSnapshot, changeType });
      },
      () => {
        this.sendInitialSnapshot(callback);
      }
    );
  }

  stream(callback: CollectionStreamCallback, onSubscribe?: () => void, onUnsubscribe?: () => void): () => void {
    const app = App.getApp(this.database.app.name);
    const database = app.plugins.database as DatabasePlugin;
    const collectionStream = database.collectionStream(this);

    if (onSubscribe) {
      collectionStream.on("subscribe", onSubscribe);
    }

    if (onUnsubscribe) {
      collectionStream.on("unsubscribe", onUnsubscribe);
    }

    collectionStream.register(callback);

    return () => {
      database.collectionStream(this).unregister(callback);
    };
  }

  private async sendInitialSnapshot(callback: CollectionSnapshotCallback) {
    this.snapshot = await this.get();
    callback(this.snapshot);
  }
}

export default CollectionReference;
