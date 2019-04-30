const querystring = require('querystring');
const io = require('socket.io-client');
const DatabaseReference = require('./DatabaseReference');

class DatabasePlugin {  
  constructor(app) {
    this.app = app;
    this.app.database = this.database.bind(this);

    this.client = io(this.url);

    this.client.on('connect', () => {
      this.app.log('database', 'connected');
    });

    this.client.on('disconnect', (r) => {
      this.app.log('database', 'disconnected');
      console.log(r);
    });
    
    this.client.on('error', (r) => {
      this.app.log('database', 'error');
      console.log(r);
    });
  }

  get url() {
    const qs = querystring.encode({
      key: this.app.config.apiKey,
      ...(this.app.config.queryString || {}) 
    });
    
    return `${this.app.config.databaseUrl}?${qs}`;
  }
  
  database(name = 'default') {
    return new DatabaseReference(name, this.app.ref);
  }
}

DatabasePlugin.PLUGIN_NAME = 'database';
module.exports = DatabasePlugin;