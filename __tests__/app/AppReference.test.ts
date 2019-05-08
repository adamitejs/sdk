import AppReference from "../../src/app/AppReference";

describe("AppReference", () => {
  describe("constructor", () => {
    it("should save the name", () => {
      const appRef = new AppReference("test");
      expect(appRef.name).toBe("test");
    });
  });
});
