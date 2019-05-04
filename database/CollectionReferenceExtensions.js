const CollectionReference = require("./CollectionReference");

const App = require("../app/App");
const DatabaseSerializer = require("../core/serialization/DatabaseSerializer");
const DocumentSnapshot = require("./DocumentSnapshot");
const CollectionSnapshot = require("./CollectionSnapshot");

CollectionReference.prototype.create = async function(data) {
  const app = App.getApp(this.database.app.name);
  const {
    database: { client }
  } = app.plugins;

  const { snapshot } = await client.invoke("createDocument", {
    ref: DatabaseSerializer.serializeCollectionReference(this),
    data
  });

  return new DocumentSnapshot(snapshot.ref, snapshot.data);
};

CollectionReference.prototype.get = async function(data) {
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

CollectionReference.prototype.onSnapshot = async function(callback) {
  // create the in-memory snapshot if needed
  this._snapshot = this._snapshot || new CollectionSnapshot(this);

  this.stream(
    ({ changeType, oldSnapshot, newSnapshot }) => {
      // mutate the in-memory snapshot, and send it in the callback
      this._snapshot = this._snapshot.mutate(
        changeType,
        oldSnapshot,
        newSnapshot
      );
      callback(this._snapshot, { newSnapshot, oldSnapshot, changeType });
    },
    { initialValues: true }
  );
};

CollectionReference.prototype.stream = async function(
  callback,
  options = { initialValues: false }
) {
  App.getApp(this.database.app.name)
    .plugins.database.collectionStream(this)
    .register(callback, options.initialValues);
};
