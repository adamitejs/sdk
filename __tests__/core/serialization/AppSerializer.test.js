const AppReference = require("../../../app/AppReference");
const AppSerializer = require("../../../core/serialization/AppSerializer");

describe("AppSerializer", () => {
  describe("serializeAppReference", () => {
    it("should serialize a AppReference", () => {
      const appRef = new AppReference("default");
      const serializedAppReference = AppSerializer.serializeAppReference(appRef);
      expect(serializedAppReference.name).toBe("default");
      expect(serializedAppReference.type).toBe("AppReference");
    });
  });
});
