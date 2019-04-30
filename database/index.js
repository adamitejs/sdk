const DatabasePlugin = require('./DatabasePlugin');

module.exports = {
  DatabasePlugin,
  DocumentReference: require('./DocumentReference'),
  CollectionReference: require('./CollectionReference'),
  DatabaseReference: require('./DatabaseReference')
};

require('./DatabaseReferenceExtensions');
require('./CollectionReferenceExtensions');
require('./DocumentReferenceExtensions');