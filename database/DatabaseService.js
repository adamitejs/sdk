const querystring = require('querystring');
const io = require('socket.io-client');
const DatabaseReference = require('./DatabaseReference');

class DatabaseService {
  constructor(app) {
    this.app = app;
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

module.exports = DatabaseService;