const AppReference = require('../../app/AppReference');
const ServiceReference = require('../../app/ServiceReference');
const DatabaseReference = require('../../database/DatabaseReference');
const DocumentReference = require('../../database/DocumentReference');
const CollectionReference = require('../../database/CollectionReference');

describe('DatabaseReference', () => {
  describe('constructor', () => {
    it('should construct a DatabaseReference', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      expect(databaseRef.name).toBe('default');
      expect(databaseRef.service).toBe(serviceRef);
    });
  });

  describe('path', () => {
    it('should return the correct path', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      expect(databaseRef.path).toBe('/default/database/default');
    });
  });

  describe('collection', () => {
    it('should return a CollectionReference', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      const collectionRef = databaseRef.collection('users');
      expect(collectionRef.name).toBe('users');
      expect(collectionRef.database).toBe(databaseRef);
    });
  });

  describe('fromPath', () => {
    it('should return a DocumentReference', () => {
      const path = '/default/database/default/users/10';
      const documentRef = DatabaseReference.fromPath(path);
      expect(documentRef instanceof DocumentReference).toBe(true);
      expect(documentRef.name).toBe('10');
      expect(documentRef.collection.name).toBe('users');
      expect(documentRef.collection.database.name).toBe('default');
      expect(documentRef.collection.database.service.name).toBe('database');
      expect(documentRef.collection.database.service.app.name).toBe('default');
    });

    it('should return a CollectionReference', () => {
      const path = '/default/database/default/users';
      const collectionRef = DatabaseReference.fromPath(path);
      expect(collectionRef instanceof CollectionReference).toBe(true);
      expect(collectionRef.name).toBe('users');
      expect(collectionRef.database.name).toBe('default');
      expect(collectionRef.database.service.name).toBe('database');
      expect(collectionRef.database.service.app.name).toBe('default');
    });

    it('should return a DatabaseReference', () => {
      const path = '/default/database/default';
      const databaseRef = DatabaseReference.fromPath(path);
      expect(databaseRef instanceof DatabaseReference).toBe(true);
      expect(databaseRef.name).toBe('default');
      expect(databaseRef.service.name).toBe('database');
      expect(databaseRef.service.app.name).toBe('default');
    });
  });
});