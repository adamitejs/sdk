import AppReference from "../../src/app/AppReference";
import DatabaseReference from "../../src/database/DatabaseReference";
import CollectionReference from "../../src/database/CollectionReference";

describe("DatabaseReference", () => {
  describe("constructor", () => {
    it("should construct a DatabaseReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      expect(databaseRef.name).toBe("default");
      expect(databaseRef.app).toEqual(appRef);
    });
  });

  describe("collection", () => {
    it("should return a collection", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const collectionRef = new CollectionReference("users", databaseRef);
      expect(databaseRef.collection("users")).toEqual(collectionRef);
    });
  });
});
