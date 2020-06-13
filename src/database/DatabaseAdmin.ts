import { DatabaseReference } from ".";
import { App } from "../app";
import DatabasePlugin from "./DatabasePlugin";
import { DatabaseSerializer } from "../serialization";

class DatabaseAdmin {
  public ref: DatabaseReference;

  constructor(ref: DatabaseReference) {
    this.ref = ref;
  }

  async getCollections() {
    const app = App.getApp(this.ref.app.name);
    const { client } = app.plugins.database as DatabasePlugin;

    if (!client) {
      throw new Error("The database plugin is not enabled on app instance: " + app.ref.name);
    }

    const { collections } = await client.invoke("admin.getCollections", {
      ref: DatabaseSerializer.serializeDatabaseReference(this.ref)
    });

    return collections;
  }
}

export default DatabaseAdmin;
