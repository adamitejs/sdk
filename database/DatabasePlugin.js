const querystring = require('querystring');
const io = require('socket.io-client');
const DatabaseReference = require('./DatabaseReference');
const DocumentStream = require('./DocumentStream');
const CollectionStream = require('./CollectionStream');

class DatabasePlugin {  
  constructor(app) {
    this.app = app;
    this.app.database = this.database.bind(this);

    // Intialisation of Caches.
    this.documentStreamCache = {};
    this.collectionStreamCache = {};

    // Initialisation of Socket Connection.
    this.client = io(this.url);

    this.client.on('connect', () => {
      this.app.log('database', 'connected');
    });

    this.client.on('disconnect', (r) => {
      this.app.log('database', 'disconnected');
      console.log(r);
    });
    
    this.client.on('error', (r) => {
      this.app.log('database', 'error');
      console.log(r);
    });
  }

  /**
   * Accepts a DocumentReference and returns a DocumentStream allowing for the
   * registration of handlers for updates of the corresponding DocumentSnapshot.
   * 
   * @param {DocumentReference} documentReference 
   */
  documentStream(documentReference) {
    const hashKey = documentReference.hash;
    var hashValue = this.documentStreamCache[hashKey];
    
    if (hashValue == undefined) {
      hashValue = new DocumentStream(this, documentReference);
      this.documentStreamCache[hashKey] = hashValue;
      return hashValue;
    } else {
      return hashValue;
    }
  }

  /**
   * Accepts a CollectionReference and returns a CollectionStream allowing for
   * the registration of handlers for updates of the corresponding CollectionSnapshot.
   */
  collectionStream(collectionReference) {
    const hashKey = collectionReference.name;
    var hashValue = this.collectionStreamCache[hashKey];
    
    if (hashValue == undefined) {
      hashValue = new CollectionStream(this, collectionReference);
      this.collectionStreamCache[hashKey] = hashValue;
      return hashValue;
    } else {
      return hashValue;
    }
  }

  get url() {
    const qs = querystring.encode({
      key: this.app.config.apiKey,
      ...(this.app.config.queryString || {}) 
    });
    
    return `${this.app.config.databaseUrl}?${qs}`;
  }
  
  database(name = 'default') {
    return new DatabaseReference(name, this.app.ref);
  }
}

DatabasePlugin.PLUGIN_NAME = 'database';
module.exports = DatabasePlugin;