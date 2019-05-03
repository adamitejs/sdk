const CollectionReference = require("./CollectionReference");

const App = require("../app/App");
const DatabaseSerializer = require("../core/serialization/DatabaseSerializer");
const DocumentSnapshot = require("./DocumentSnapshot");
const CollectionSnapshot = require("./CollectionSnapshot");

CollectionReference.prototype.create = async function(data) {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.database.app.name);
    const {
      database: { client }
    } = app.plugins;

    client.emit(
      "command",
      {
        name: "database.createDocument",
        args: {
          ref: DatabaseSerializer.serializeCollectionReference(this),
          data
        }
      },
      response => {
        if (response.error) return reject(response.error);
        const {
          snapshot: { ref, data }
        } = response;
        resolve(new DocumentSnapshot(ref, data));
      }
    );
  });
};

CollectionReference.prototype.get = async function(data) {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.database.app.name);
    const {
      database: { client }
    } = app.plugins;

    client.emit(
      "command",
      {
        name: "database.readCollection",
        args: {
          ref: DatabaseSerializer.serializeCollectionReference(this),
          data
        }
      },
      response => {
        if (response.error) return reject(response.error);
        const {
          snapshot: { ref, data }
        } = response;
        resolve(new CollectionSnapshot(ref, data));
      }
    );
  });
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
