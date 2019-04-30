const CollectionReference = require('./CollectionReference');

const App = require('../app/App');
const DatabaseSerializer = require('../core/serialization/DatabaseSerializer');
const DocumentSnapshot = require('./DocumentSnapshot');
const CollectionSnapshot = require('./CollectionSnapshot');

CollectionReference.prototype.create = async function(data) {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.database.app.name);
    const { database: { client } } = app.plugins;
    
    client.emit('command', {
      name: 'database.createDocument',
      args: { ref: DatabaseSerializer.serializeCollectionReference(this), data }
    }, (response) => {
      if (response.error) return reject(response.error);
      const { snapshot: { ref, data } } = response;
      resolve(new DocumentSnapshot(ref, data));
    });
  });
};

CollectionReference.prototype.get = async function(data) {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.database.app.name);
    const { database: { client } } = app.plugins;
    
    client.emit('command', {
      name: 'database.readCollection',
      args: { ref: DatabaseSerializer.serializeCollectionReference(this), data }
    }, (response) => {
      if (response.error) return reject(response.error);
      const { snapshot: { ref, data } } = response;
      resolve(new CollectionSnapshot(ref, data));
    });
  });
};

CollectionReference.prototype.onSnapshot = async function(callback) {
  const app = App.getApp(this.database.app.name);
  const { database: { client } } = app.plugins;
  
  client.emit('command', {
    name: 'database.subscribeCollection',
    args: { ref: DatabaseSerializer.serializeCollectionReference(this) }
  }, (response) => {
    if (response.error) return reject(response.error);
    const { subscription: { id, ref } } = response;
    
    client.on(id, (update) => {
      if (update.error) return reject(response.error);
      
      // create the in-memory snapshot if needed
      this._snapshot = this._snapshot || new CollectionSnapshot(ref);
      
      // deserialize the document snapshots
      const oldSnapshot = update.oldSnapshot && new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);
      const newSnapshot = update.newSnapshot && new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);
      
      // mutate the in-memory snapshot, and send it in the callback
      this._snapshot = this._snapshot.mutate(update.changeType, oldSnapshot, newSnapshot);
      callback(this._snapshot, { newSnapshot, oldSnapshot, changeType: update.changeType });
    });
  });
};