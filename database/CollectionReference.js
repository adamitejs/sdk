const App = require('../app/App');
const DocumentReference = require('./DocumentReference');
const CollectionSnapshot = require('./CollectionSnapshot');

class CollectionReference {
  constructor(name, database) {
    this.name = name;
    this.database = database;
    this.handlers = [];
  }

  get path() {
    return [
      this.database.path,
      this.name
    ].join('/');
  }

  doc(name) {
    return new DocumentReference(name, this);
  }

  async get() {
    return new Promise((resolve, reject) => {
      const app = App.getApp(this.database.service.app.name);
      const database = app.service('database');
      
      database.client.emit('command', {
        name: 'database.readCollection',
        args: { ref: this.path }
      }, (snapshot) => {
        if (snapshot.error) {
          reject(snapshot.error);
        } else {
          resolve(CollectionSnapshot.fromServerSnapshot(this, snapshot));
        }
      });
    });
  }

  onSnapshot(handler) {
    this.subscribeToChanges();
    this.handlers.push(handler);
  }
}

module.exports = CollectionReference;