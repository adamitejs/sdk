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

  async getUserInfo(userId: string) {
    const app = App.getApp(this.ref.name);
    const { client } = app.plugins.auth as AuthPlugin;
    const { userInfo } = await client.invoke("admin.getUserInfo", { userId });
    return userInfo;
  }

  async setUserEmail(userId: string, email: string) {
    const app = App.getApp(this.ref.name);
    const { client } = app.plugins.auth as AuthPlugin;
    await client.invoke("admin.setUserEmail", { userId, email });
  }

  async setUserPassword(userId: string, password: string) {
    const app = App.getApp(this.ref.name);
    const { client } = app.plugins.auth as AuthPlugin;
    await client.invoke("admin.setUserPassword", { userId, password });
  }

  async setUserDisabled(userId: string, disabled: boolean) {
    const app = App.getApp(this.ref.name);
    const { client } = app.plugins.auth as AuthPlugin;
    await client.invoke("admin.setUserDisabled", { userId, disabled });
  }

  async deleteUser(userId: string) {
    const app = App.getApp(this.ref.name);
    const { client } = app.plugins.auth as AuthPlugin;
    await client.invoke("admin.deleteUser", { userId });
  }
}

export default AuthAdmin;
