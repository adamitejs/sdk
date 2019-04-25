const CollectionReference = require('../../database/CollectionReference');

describe('CollectionReference', () => {
  describe('constructor', () => {
    it('should construct a CollectionReference', () => {
      const collectionRef = new CollectionReference('users');
      expect(collectionRef.name).toBe('users');
    });
  });

  describe('doc', () => {
    it('should return a DocumentReference', () => {
      const collectionRef = new CollectionReference('users');
      const documentRef = collectionRef.doc('10');
      expect(documentRef.id).toBe('10');
      expect(documentRef.collection).toEqual(collectionRef);
    });
  });
});