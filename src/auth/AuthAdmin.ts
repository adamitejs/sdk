import { App, AppReference } from "../app";
import AuthPlugin from "./AuthPlugin";

class AuthAdmin {
  public ref: AppReference;

  constructor(ref: AppReference) {
    this.ref = ref;
  }

  async getUsers() {
    const app = App.getApp(this.ref.name);
    const { client } = app.plugins.auth as AuthPlugin;
    const { users } = await client.invoke("admin.getUsers");
    return users;
  }
}

export default AuthAdmin;
