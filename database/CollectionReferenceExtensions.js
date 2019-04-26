const CollectionReference = require('./CollectionReference');

const App = require('../app/App');
const DatabaseSerializer = require('../core/serialization/DatabaseSerializer');
const DocumentSnapshot = require('./DocumentSnapshot');

CollectionReference.prototype.create = async function(data) {
  return new Promise((resolve, reject) => {
    const app = App.getApp(this.database.app.name);
    const { database: { client } } = app.services;
    
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