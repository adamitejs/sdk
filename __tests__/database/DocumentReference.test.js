const CollectionReference = require('../../database/CollectionReference');
const DocumentReference = require('../../database/DocumentReference');

describe('DocumentReference', () => {
  describe('constructor', () => {
    it('should construct a DocumentReference', () => {
      const collectionRef = new CollectionReference('users');
      const ref = new DocumentReference('10', collectionRef);
      expect(ref.id).toBe('10');
      expect(ref.collection).toBe(collectionRef);
    });
  });

  describe('get', () => {

  });
});