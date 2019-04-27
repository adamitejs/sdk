const DocumentReference = require('./DocumentReference');

const App = require('../app/App');
const DatabaseSerializer = require('../core/serialization/DatabaseSerializer');
const DocumentSnapshot = require('./DocumentSnapshot');

DocumentReference.prototype.get = async function() {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.collection.database.app.name);
    const { database: { client } } = app.services;
    
    client.emit('command', {
      name: 'database.readDocument',
      args: { ref: DatabaseSerializer.serializeDocumentReference(this) }
    }, (response) => {
      if (response.error) return reject(response.error);
      const { snapshot: { ref, data } } = response;
      resolve(new DocumentSnapshot(ref, data));
    });
  });
};

DocumentReference.prototype.update = async function(data) {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.collection.database.app.name);
    const { database: { client } } = app.services;
    
    client.emit('command', {
      name: 'database.updateDocument',
      args: { ref: DatabaseSerializer.serializeDocumentReference(this), data }
    }, (response) => {
      if (response.error) return reject(response.error);
      const { snapshot: { ref, data } } = response;
      resolve(new DocumentSnapshot(ref, data));
    });
  });
};

DocumentReference.prototype.delete = async function() {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.collection.database.app.name);
    const { database: { client } } = app.services;
    
    client.emit('command', {
      name: 'database.deleteDocument',
      args: { ref: DatabaseSerializer.serializeDocumentReference(this) }
    }, (response) => {
      if (response.error) return reject(response.error);
      const { snapshot: { ref, data } } = response;
      resolve(new DocumentSnapshot(ref, data));
    });
  });
};

DocumentReference.prototype.onSnapshot = async function(callback) {
  const app = App.getApp(this.collection.database.app.name);
  const { database: { client } } = app.services;
  
  client.emit('command', {
    name: 'database.subscribeDocument',
    args: { ref: DatabaseSerializer.serializeDocumentReference(this) }
  }, (response) => {
    if (response.error) return reject(response.error);
    const { subscription: { id } } = response;
    
    client.on(id, (update) => {
      if (update.error) return reject(response.error);
      const newSnapshot = update.newSnapshot && new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);
      const oldSnapshot = update.oldSnapshot && new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);
      callback(newSnapshot, { newSnapshot, oldSnapshot, changeType: update.changeType });
    });
  });
};