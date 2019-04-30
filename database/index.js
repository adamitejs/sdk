const { App } = require('../app');
const DatabasePlugin = require('./DatabasePlugin');

module.exports = {
  registerDatabasePlugin: () => {
    App.addPlugin('database', function(app) {
      const plugin = new DatabasePlugin(app);
      app.database = plugin.database.bind(plugin);
      return plugin;
    });
  },
  
  DatabasePlugin,
  DocumentReference: require('./DocumentReference'),
  CollectionReference: require('./CollectionReference'),
  DatabaseReference: require('./DatabaseReference')
};

require('./DatabaseReferenceExtensions');
require('./CollectionReferenceExtensions');
require('./DocumentReferenceExtensions');