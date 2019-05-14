import client from "@adamite/relay-client";
import { EventEmitter } from "events";
import * as jwt from "jsonwebtoken";
import App from "../app/App";
import {
  AuthServiceToken,
  AuthStateChangeCallback,
  AuthUser
} from "./AuthTypes";
import { AdamitePlugin } from "../app";

class AuthPlugin extends EventEmitter implements AdamitePlugin {
  public app: App;

  public client: any;

  public currentToken: string | undefined;

  constructor(app: App) {
    super();
    this.app = app;
  }

  getPluginName() {
    return "auth";
  }

  initialize() {
    this.client = client(this.app, {
      service: "auth",
      url: this.app.config.authUrl
    });

    this.loadAuthState();
  }

  get currentUser(): AuthUser {
    if (!this.currentToken) return undefined;

    const decodedToken = jwt.decode(this.currentToken) as AuthServiceToken;
    if (!decodedToken) return undefined;

    return {
      id: decodedToken["sub"],
      email: decodedToken["email"],
      jwt: decodedToken,
      token: this.currentToken
    };
  }

  async createUser(email: string, password: string) {
    const { token } = await this.client.invoke("createUser", {
      email,
      password
    });

    this.saveAuthState(token);
    return this.currentUser;
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    const { token } = await this.client.invoke("loginWithEmailAndPassword", {
      email,
      password
    });

    this.saveAuthState(token);
    return this.currentUser;
  }

  async validateToken(token: string) {
    const { data } = await this.client.invoke("validateToken", {
      token
    });

    return data;
  }

  logout() {
    this.clearAuthState();
  }

  onAuthStateChange(callback: AuthStateChangeCallback) {
    callback(this.currentUser);
    this.on("authStateChange", callback);
    return () => this.off("authStateChange", callback);
  }

  private loadAuthState() {
    if (typeof window === "undefined" || !window.localStorage) return;

    const tokenKey = `adamite:auth:${this.app.ref.name}.token`;
    const localStorageToken = window.localStorage.getItem(tokenKey);

    this.currentToken = localStorageToken || undefined;
  }

  private saveAuthState(token: string) {
    this.currentToken = token;
    this.emit("authStateChange", this.currentUser);
    if (typeof window === "undefined" || !window.localStorage) return;
    const tokenKey = `adamite:auth:${this.app.ref.name}.token`;
    window.localStorage.setItem(tokenKey, token);
  }

  private clearAuthState() {
    this.currentToken = undefined;
    this.emit("authStateChange", this.currentUser);
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(`adamite:auth:${this.app.ref.name}.token`);
  }
}

(AuthPlugin as any).PLUGIN_NAME = "auth";
export default AuthPlugin;
