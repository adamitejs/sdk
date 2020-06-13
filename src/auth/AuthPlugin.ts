import * as jwtdecode from "jwt-decode";
import App from "../app/App";
import { AuthServiceToken, AuthStateChangeCallback, AuthUser, PostRegistrationCallback } from "./AuthTypes";
import { AdamitePlugin } from "../app";
import StorageProvider from "./StorageProvider";
import LocalStorageProvider from "./LocalStorageProvider";

class AuthPlugin extends AdamitePlugin {
  public currentToken: string | undefined;

  private storageProvider: StorageProvider;

  constructor(app: App) {
    super(app);
    this.app = app;
    this.storageProvider = new LocalStorageProvider();
    this.loadInitialAuthState();
  }

  getPluginName() {
    return "auth";
  }

  useProvider(provider: StorageProvider) {
    this.storageProvider = provider;
    this.loadInitialAuthState();
  }

  get currentUser(): AuthUser | undefined {
    if (!this.currentToken) return undefined;

    const decodedToken = jwtdecode(this.currentToken) as AuthServiceToken;
    if (!decodedToken) return undefined;

    return {
      id: decodedToken["sub"],
      email: decodedToken["email"],
      jwt: decodedToken,
      token: this.currentToken
    };
  }

  async createUser(email: string, password: string, postRegistration?: PostRegistrationCallback, bypassLogin?: boolean) {
    const { token } = await this.client?.invoke("createUser", {
      email,
      password,
      bypassLogin
    });

    if (bypassLogin) return token;

    this.currentToken = token;
    if (postRegistration) await postRegistration(this.currentUser);

    await this.saveAuthState(token);
    return this.currentUser;
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    const { token } = await this.client?.invoke("loginWithEmailAndPassword", {
      email,
      password
    });

    await this.saveAuthState(token);
    return this.currentUser;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    if (!this.currentToken) {
      throw new Error("Can't change password because the user is not logged in.");
    }

    const { token } = await this.client?.invoke("changePassword", {
      oldPassword,
      newPassword
    });

    
    await this.saveAuthState(token);
    this.emit("authStateChange", this.currentUser);
  }

  async changeEmail(password: string, email: string) {
    if (!this.currentToken) {
      throw new Error("Can't change email because the user is not logged in.");
    }

    const { token } = await this.client?.invoke("changeEmail", {
      password,
      email
    });

    await this.saveAuthState(token);
    this.emit("authStateChange", this.currentUser);
  }

  async validateToken(token: string) {
    const { data } = await this.client?.invoke("validateToken", {
      token
    });

    return data;
  }

  async logout() {
    await this.clearAuthState();
  }

  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    callback(this.currentUser);
    this.on("authStateChange", callback);

    return () => {
      this.off("authStateChange", callback);
    };
  }

  private async loadInitialAuthState() {
    await this.loadAuthState();
    this.emit("authStateChange", this.currentUser);
  }

  private checkForExpiredToken() {
    if (!this.currentToken) return;

    const decodedToken = jwtdecode(this.currentToken) as AuthServiceToken;
    if (!decodedToken) return;

    const isTokenExpired = decodedToken.exp < Math.floor(Date.now() / 1000);

    if (isTokenExpired) {
      this.clearAuthState();
    }
  }

  private async loadAuthState() {
    const token = await this.storageProvider.getToken(this.app.ref.name);
    this.currentToken = token || undefined;
    this.checkForExpiredToken();
  }

  private async saveAuthState(token: string) {
    this.currentToken = token;
    this.emit("authStateChange", this.currentUser);
    await this.storageProvider.saveToken(this.app.ref.name, token);
  }

  private async clearAuthState() {
    this.currentToken = undefined;
    this.emit("authStateChange", this.currentUser);
    await this.storageProvider.clearToken(this.app.ref.name);
  }
}

export default AuthPlugin;
