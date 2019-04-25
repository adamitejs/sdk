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