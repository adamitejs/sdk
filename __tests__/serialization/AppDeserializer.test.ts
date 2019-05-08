import AppReference from "../../src/app/AppReference";
import AppSerializer from "../../src/serialization/AppSerializer";
import AppDeserializer from "../../src/serialization/AppDeserializer";

describe("AppDeserializer", () => {
  describe("deserializeAppReference", () => {
    it("should deserialize a AppReference", () => {
      const appRef = new AppReference("default");
      const serializedAppRef = AppSerializer.serializeAppReference(appRef);
      const deserializedAppRef = AppDeserializer.deserializeAppReference(
        serializedAppRef
      );
      expect(deserializedAppRef).toEqual(appRef);
    });
  });
});
