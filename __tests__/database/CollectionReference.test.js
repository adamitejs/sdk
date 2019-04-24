const AppReference = require('../../app/AppReference');
const ServiceReference = require('../../app/ServiceReference');
const DatabaseReference = require('../../database/DatabaseReference');
const CollectionReference = require('../../database/CollectionReference');

describe('CollectionReference', () => {
  describe('constructor', () => {
    it('should construct a CollectionReference', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      const collectionRef = new CollectionReference('users', databaseRef);
      expect(collectionRef.name).toBe('users');
      expect(collectionRef.database).toBe(databaseRef);
    });
  });

  describe('path', () => {
    it('should return the correct path', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      const collectionRef = new CollectionReference('users', databaseRef);
      expect(collectionRef.path).toBe('/default/database/default/users');
    });
  });

  describe('doc', () => {
    it('should return a DocumentReference', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      const collectionRef = new CollectionReference('users', databaseRef);
      const documentRef = collectionRef.doc('10');
      expect(documentRef.name).toBe('10');
      expect(documentRef.collection).toBe(collectionRef);
    });
  });
});