const jwt = require("jsonwebtoken");
const relay = require("@adamite/relay");
const { EventEmitter } = require("events");

class AuthPlugin extends EventEmitter {
  constructor(app) {
    super();

    this.app = app;
    this.app.auth = () => this;
    this._loadAuthState();

    this.client = relay.client(app, {
      service: "auth",
      url: this.app.config.authUrl
    });
  }

  get currentUser() {
    if (this.currentToken) {
      const decodedToken = jwt.decode(this.currentToken);
      return {
        id: decodedToken.sub,
        email: decodedToken.email,
        jwt: decodedToken,
        token: this.currentToken
      };
    } else {
      return null;
    }
  }

  async createUser(email, password) {
    const { token } = await this.client.invoke("createUser", {
      email,
      password
    });

    this._saveAuthState(token);
    return this.currentUser;
  }

  async loginWithEmailAndPassword(email, password) {
    const { token } = await this.client.invoke("loginWithEmailAndPassword", {
      email,
      password
    });

    this._saveAuthState(token);
    return this.currentUser;
  }

  async validateToken(token) {
    const { data } = await this.client.invoke("validateToken", {
      token
    });

    return data;
  }

  logout() {
    this._clearAuthState();
  }

  onAuthStateChange(callback) {
    callback(this.currentUser);
    this.on("authStateChange", callback);
    return () => this.off("authStateChange", callback);
  }

  _loadAuthState() {
    if (typeof window === "undefined" || !window.localStorage) return;
    this.currentToken = window.localStorage.getItem(
      `adamite:auth:${this.app.ref.name}.token`
    );
  }

  _saveAuthState(token) {
    this.currentToken = token;
    this.emit("authStateChange", this.currentUser);
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(
      `adamite:auth:${this.app.ref.name}.token`,
      token
    );
  }

  _clearAuthState() {
    this.currentToken = null;
    this.emit("authStateChange", this.currentUser);
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(`adamite:auth:${this.app.ref.name}.token`);
  }
}

AuthPlugin.PLUGIN_NAME = "auth";
module.exports = AuthPlugin;
