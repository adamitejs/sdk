const io = require('socket.io-client');
const { ServiceReference } = require('../app');
const DatabaseReference = require('./DatabaseReference');

class DatabaseService {
  constructor(app) {
    this.app = app;
    this.ref = new ServiceReference('database', this.app.ref);
    this.client = io(`${this.app.config.databaseUrl}?key=${this.app.config.apiKey}`);

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
  
  database(name = 'default') {
    return new DatabaseReference(name, this.ref);
  }
}

module.exports = DatabaseService;