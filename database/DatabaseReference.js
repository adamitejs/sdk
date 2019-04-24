const AppReference = require('../app/AppReference');
const ServiceReference = require('../app/ServiceReference');
const CollectionReference = require('./CollectionReference');

class DatabaseReference {
  constructor(name, service) {
    this.name = name;
    this.service = service;
  }

  get path() {
    return [
      this.service.path,
      this.name
    ].join('/');
  }

  collection(name) {
    return new CollectionReference(name, this);
  }

  static fromPath(path) {
    const parts = path.slice(1).split('/');
    const DOCUMENT_LENGTH = 5;
    const COLLECTION_LENGTH = 4;
    const DATABASE_LENGTH = 3;

    switch (parts.length) {
      case DOCUMENT_LENGTH: {
        const [ appName, serviceName, databaseName, collectionName, documentName ] = parts;

        const appRef = new AppReference(appName);
        const serviceRef = new ServiceReference(serviceName, appRef);
        const databaseRef = new DatabaseReference(databaseName, serviceRef);
        
        return databaseRef.collection(collectionName).doc(documentName);
      }
      
      case COLLECTION_LENGTH: {
        const [ appName, serviceName, databaseName, collectionName ] = parts;

        const appRef = new AppReference(appName);
        const serviceRef = new ServiceReference(serviceName, appRef);
        const databaseRef = new DatabaseReference(databaseName, serviceRef);
        
        return databaseRef.collection(collectionName);
      }
      
      case DATABASE_LENGTH: {
        const [ appName, serviceName, databaseName ] = parts;

        const appRef = new AppReference(appName);
        const serviceRef = new ServiceReference(serviceName, appRef);
        
        return new DatabaseReference(databaseName, serviceRef);
      }
    }
  }
}

module.exports = DatabaseReference;