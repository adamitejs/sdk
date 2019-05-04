const AppReference = require("../../app/AppReference");
const DatabaseReference = require("../../database/DatabaseReference");
const CollectionReference = require("../../database/CollectionReference");

describe("CollectionReference", () => {
  describe("constructor", () => {
    it("should construct a CollectionReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const collectionRef = new CollectionReference("users", databaseRef);
      expect(collectionRef.name).toBe("users");
      expect(collectionRef.hash).toBe(
        new Buffer("default/default/users").toString("base64")
      );
    });
  });

  describe("doc", () => {
    it("should return a DocumentReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const collectionRef = new CollectionReference("users", databaseRef);
      const documentRef = collectionRef.doc("10");
      expect(documentRef.id).toBe("10");
      expect(documentRef.collection).toEqual(collectionRef);
    });
  });
});
