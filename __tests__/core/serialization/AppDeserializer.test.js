const AppReference = require('../../../app/AppReference');
const AppDeserializer = require('../../../core/serialization/AppDeserializer');
const AppSerializer = require('../../../core/serialization/AppSerializer');

describe('AppDeserializer', () => {
  describe('deserializeAppReference', () => {
    it('should deserialize a AppReference', () => {
      const appRef = new AppReference('default');
      const serializedAppRef = AppSerializer.serializeAppReference(appRef);
      const deserializedAppRef = AppDeserializer.deserializeAppReference(serializedAppRef);
      expect(deserializedAppRef).toEqual(appRef);
    });
  });
});