const querystring = require('querystring');
const io = require('socket.io-client');

class AuthPlugin {  
  constructor(app) {
    this.app = app;
    this.client = io(this.url);
    this.app.auth = () => this;

    this.client.on('connect', () => {
      this.app.log('auth', 'connected');
    });

    this.client.on('disconnect', (r) => {
      this.app.log('auth', 'disconnected');
      console.log(r);
    });
    
    this.client.on('error', (r) => {
      this.app.log('auth', 'error');
      console.log(r);
    });
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
      this.client.emit('command', {
        name: 'auth.createUser',
        args: { email, password }
      }, ({ error, token }) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  async loginWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      this.client.emit('command', {
        name: 'auth.loginWithEmailAndPassword',
        args: { email, password }
      }, ({ error, token }) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(token);
      });
    });
  }

  async validateToken(token) {
    return new Promise((resolve, reject) => {
      this.client.emit('command', {
        name: 'auth.validateToken',
        args: { token }
      }, ({ error, data }) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data);
      });
    });
  }
}

AuthPlugin.PLUGIN_NAME = 'auth';
module.exports = AuthPlugin;