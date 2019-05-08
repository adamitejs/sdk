import DocumentReference from "./DocumentReference";

import App from "../app/App";
import DatabaseSerializer from "../core/serialization/DatabaseSerializer";
import DocumentSnapshot from "./DocumentSnapshot";
import {
  DocumentStreamCallback,
  DocumentSnapshotCallback,
  StreamChanges,
  StreamOptions
} from "./DatabaseTypes";
import DatabaseDeserializer from "../core/serialization/DatabaseDeserializer";

(DocumentReference.prototype as any).get = async function() {
  const app = App.getApp(this.collection.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("readDocument", {
    ref: DatabaseSerializer.serializeDocumentReference(this)
  });

  return new DocumentSnapshot(
    DatabaseDeserializer.deserializeDocumentReference(snapshot.ref),
    snapshot.data
  );
};

(DocumentReference.prototype as any).update = async function(data: any) {
  const app = App.getApp(this.collection.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("updateDocument", {
    ref: DatabaseSerializer.serializeDocumentReference(this),
    data
  });

  return new DocumentSnapshot(
    DatabaseDeserializer.deserializeDocumentReference(snapshot.ref),
    snapshot.data
  );
};

(DocumentReference.prototype as any).delete = async function() {
  const app = App.getApp(this.collection.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("deleteDocument", {
    ref: DatabaseSerializer.serializeDocumentReference(this)
  });

  return new DocumentSnapshot(
    DatabaseDeserializer.deserializeDocumentReference(snapshot.ref),
    snapshot.data
  );
};

(DocumentReference.prototype as any).onSnapshot = async function(
  callback: DocumentSnapshotCallback
) {
  this.stream(
    ({ changeType, newSnapshot, oldSnapshot }: StreamChanges) => {
      if (!newSnapshot) return;
      callback(newSnapshot, { newSnapshot, oldSnapshot, changeType });
    },
    { initialValues: true }
  );
};

(DocumentReference.prototype as any).stream = async function(
  callback: DocumentStreamCallback,
  { initialValues = false }: StreamOptions
) {
  App.getApp(this.collection.database.app.name)
    .plugins.database.documentStream(this)
    .register(callback, initialValues);
};
