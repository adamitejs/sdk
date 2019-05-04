const { EventEmitter } = require("events");
const querystring = require("querystring");
const io = require("socket.io-client");
const jwt = require("jsonwebtoken");

class AuthPlugin extends EventEmitter {
  constructor(app) {
    super();

    this.app = app;
    this.client = io(this.url);
    this.app.auth = () => this;

    this.client.on("connect", () => {
      this.app.log("auth", "connected");
    });

    this.client.on("disconnect", r => {
      this.app.log("auth", "disconnected");
      console.log(r);
    });

    this.client.on("error", r => {
      this.app.log("auth", "error");
      console.log(r);
    });

    this._loadAuthState();
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

  get url() {
    const qs = querystring.encode({
      key: this.app.config.apiKey,
      ...(this.app.config.queryString || {})
    });

    return `${this.app.config.authUrl}?${qs}`;
  }

  async createUser(email, password) {
    return new Promise((resolve, reject) => {
      this.client.emit(
        "command",
        {
          name: "auth.createUser",
          args: { email, password }
        },
        ({ error, token }) => {
          if (error) {
            reject(error);
            return;
          }

          this._saveAuthState(token);
          resolve(this.currentUser);
        }
      );
    });
  }

  async loginWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      this.client.emit(
        "command",
        {
          name: "auth.loginWithEmailAndPassword",
          args: { email, password }
        },
        ({ error, token }) => {
          if (error) {
            reject(error);
            return;
          }

          this._saveAuthState(token);
          resolve(this.currentUser);
        }
      );
    });
  }

  async validateToken(token) {
    return new Promise((resolve, reject) => {
      this.client.emit(
        "command",
        {
          name: "auth.validateToken",
          args: { token }
        },
        ({ error, data }) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(data);
        }
      );
    });
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
    this.emit("authStateChange", this.currentToken);
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(
      `adamite:auth:${this.app.ref.name}.token`,
      token
    );
  }

  _clearAuthState() {
    this.currentToken = null;
    this.emit("authStateChange", this.currentToken);
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(`adamite:auth:${this.app.ref.name}.token`);
  }
}

AuthPlugin.PLUGIN_NAME = "auth";
module.exports = AuthPlugin;
