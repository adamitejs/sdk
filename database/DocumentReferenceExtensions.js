const DocumentReference = require("./DocumentReference");

const App = require("../app/App");
const DatabaseSerializer = require("../core/serialization/DatabaseSerializer");
const DocumentSnapshot = require("./DocumentSnapshot");

DocumentReference.prototype.get = async function() {
  const app = App.getApp(this.collection.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("readDocument", {
    ref: DatabaseSerializer.serializeDocumentReference(this)
  });

  return new DocumentSnapshot(snapshot.ref, snapshot.data);
};

DocumentReference.prototype.update = async function(data) {
  const app = App.getApp(this.collection.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("updateDocument", {
    ref: DatabaseSerializer.serializeDocumentReference(this),
    data
  });

  return new DocumentSnapshot(snapshot.ref, snapshot.data);
};

DocumentReference.prototype.delete = async function() {
  const app = App.getApp(this.collection.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("deleteDocument", {
    ref: DatabaseSerializer.serializeDocumentReference(this)
  });

  return new DocumentSnapshot(snapshot.ref, snapshot.data);
};

DocumentReference.prototype.onSnapshot = async function(callback) {
  this.stream(
    ({ changeType, newSnapshot, oldSnapshot }) => {
      callback(newSnapshot, { newSnapshot, oldSnapshot, changeType });
    },
    { initialValues: true }
  );
};

DocumentReference.prototype.stream = async function(
  callback,
  options = { initialValues: false }
) {
  App.getApp(this.collection.database.app.name)
    .plugins.database.documentStream(this)
    .register(callback, options.initialValues);
};
