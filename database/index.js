const { App } = require('../app');
const DatabaseService = require('./DatabaseService');

App.addService('database', function(app) {
  const service = new DatabaseService(app);
  app.database = service.database.bind(service);
  return service;
});

module.exports = {
  DatabaseService,
  DocumentReference: require('./DocumentReference'),
  CollectionReference: require('./CollectionReference'),
  DatabaseReference: require('./DatabaseReference')
};