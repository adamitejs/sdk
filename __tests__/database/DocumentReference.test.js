const AppReference = require('../../app/AppReference');
const ServiceReference = require('../../app/ServiceReference');
const DatabaseReference = require('../../database/DatabaseReference');
const CollectionReference = require('../../database/CollectionReference');
const DocumentReference = require('../../database/DocumentReference');

describe('DocumentReference', () => {
  describe('path', () => {
    it('should return the correct path', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      const databaseRef = new DatabaseReference('default', serviceRef);
      const collectionRef = new CollectionReference('users', databaseRef);
      const documentRef = new DocumentReference('10', collectionRef);
      expect(documentRef.path).toBe('/default/database/default/users/10');
    });
  });
});