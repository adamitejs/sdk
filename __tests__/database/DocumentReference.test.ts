import AppReference from "../../src/app/AppReference";
import DatabaseReference from "../../src/database/DatabaseReference";
import CollectionReference from "../../src/database/CollectionReference";
import DocumentReference from "../../src/database/DocumentReference";

describe("DocumentReference", () => {
  describe("constructor", () => {
    it("should construct a DocumentReference", () => {
      const appRef = new AppReference("default");
      const databaseRef = new DatabaseReference("default", appRef);
      const collectionRef = new CollectionReference("users", databaseRef);
      const ref = new DocumentReference("10", collectionRef);
      expect(ref.id).toBe("10");
      expect(ref.collection).toBe(collectionRef);
      expect(ref.hash).toBe(
        new Buffer("default/default/users/10").toString("base64")
      );
    });
  });

  describe("get", () => {});
});
