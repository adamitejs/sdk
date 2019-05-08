import CollectionReference from "./CollectionReference";

import App from "../app/App";
import DatabaseSerializer from "../serialization/DatabaseSerializer";
import DocumentSnapshot from "./DocumentSnapshot";
import CollectionSnapshot from "./CollectionSnapshot";
import {
  StreamChanges,
  CollectionSnapshotCallback,
  CollectionStreamCallback,
  StreamOptions
} from "./DatabaseTypes";
import DatabaseDeserializer from "../serialization/DatabaseDeserializer";

(CollectionReference.prototype as any).create = async function(data: any) {
  const app = App.getApp(this.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("createDocument", {
    ref: DatabaseSerializer.serializeCollectionReference(this),
    data
  });

  return new DocumentSnapshot(
    DatabaseDeserializer.deserializeDocumentReference(snapshot.ref),
    snapshot.data
  );
};

(CollectionReference.prototype as any).get = async function(data: any) {
  const app = App.getApp(this.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("readCollection", {
    ref: DatabaseSerializer.serializeCollectionReference(this),
    data
  });

  return new CollectionSnapshot(snapshot.ref, snapshot.data);
};

(CollectionReference.prototype as any).onSnapshot = async function(
  callback: CollectionSnapshotCallback
) {
  // create the in-memory snapshot if needed
  this.snapshot = this.snapshot || new CollectionSnapshot(this);

  this.stream(
    ({ changeType, oldSnapshot, newSnapshot }: StreamChanges) => {
      // mutate the in-memory snapshot, and send it in the callback
      this.snapshot = this.snapshot.mutate(
        changeType,
        oldSnapshot,
        newSnapshot
      );
      callback(this.snapshot, { newSnapshot, oldSnapshot, changeType });
    },
    { initialValues: true }
  );
};

(CollectionReference.prototype as any).stream = async function(
  callback: CollectionStreamCallback,
  { initialValues = false }: StreamOptions
) {
  App.getApp(this.database.app.name)
    .plugins.database.collectionStream(this)
    .register(callback, initialValues);
};
