const { App } = require('../app');
const DocumentSnapshot = require('./DocumentSnapshot');

class DocumentReference {
  constructor(name, collection) {
    this.name = name;
    this.collection = collection;
    this.handlers = [];
  }

  get path() {
    return [
      this.collection.path,
      this.name
    ].join('/');
  }

  get database() {
    const app = App.getApp(this.collection.database.service.app.name);
    return app.service('database');
  }

  async update(data) {
    return new Promise((resolve, reject) => {
      this.database.client.emit('command', {
        name: 'database.updateDocument',
        args: { ref: this.path, data }
      }, (snapshotData) => {
        if (snapshotData.error) {
          reject(snapshotData.error);
        } else {
          resolve(snapshotData.result);
        }
      });
    });
  }

  async get() {
    return new Promise((resolve, reject) => {
      this.database.client.emit('command', {
        name: 'database.readDocument',
        args: { ref: this.path }
      }, (snapshot) => {
        if (snapshot.error) {
          reject(snapshot.error);
        } else {
          resolve(DocumentSnapshot.fromServerSnapshot(this, snapshot));
        }
      });
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      this.database.client.emit('command', {
        name: 'database.deleteDocument',
        args: { ref: this.path }
      }, (snapshot) => {
        if (snapshot.error) {
          reject(snapshot.error);
        } else {
          resolve(this);
        }
      });
    });
  }

  onSnapshot(handler) {
    this.subscribeToChanges();
    this.handlers.push(handler);
  }

  subscribeToChanges() {
    if (this.subscribed) return;

    this.database.client.emit('command', {
      name: 'database.subscribeDocument',
      args: { ref: this.path }
    }, (subscription) => {
      this.database.client.on(subscription.callbackId, (snapshot) => {
        this.handlers.forEach((handler) => {
          handler(DocumentSnapshot.fromServerSnapshot(snapshot));
        });
      });

      this.subscribed = true;
    });
  }
}

module.exports = DocumentReference;