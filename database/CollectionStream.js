const DatabaseSerializer = require('../core/serialization/DatabaseSerializer');
const DocumentSnapshot = require('./DocumentSnapshot');

/**
 * A CollectionSream is responsible for establishing a subscription to a collection,
 * routing updates to that collection to handlers, and providing handlers with the
 * most recent version of the collection should they request it on connection.
 */
class CollectionStream {
  /**
   * Initialising a CollectionStream requires providing a DatabasePlugin from which
   * the CollectionStream will communicate to the database service. Further, it requires
   * a targetCollectionReference.
   * 
   * @param {DatabasePlugin} databasePlugin 
   * @param {CollectionReference} collectionReference 
   */
  constructor(databasePlugin, collectionReference) {
    this.collectionReference = collectionReference;
  	this.lastSnapshot = null;
    this.handlers = [];
    
    const client = databasePlugin.client;
  
    client.emit('command', {
      name: 'database.subscribeCollection',
      args: { ref: DatabaseSerializer.serializeCollectionReference(collectionReference), initialValues: true }
    }, (response) => {
      if (response.error) {
        return reject(response.error);
      } else {
        const { subscription: { id } } = response;
    
        client.on(id, (update) => {
          if (update.error) {
            return reject(response.error);
          } else {
            const oldSnapshot = update.oldSnapshot && new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);
            const newSnapshot = update.newSnapshot && new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);
            const result = { changeType: update.changeType, newSnapshot, oldSnapshot };
            this.lastSnapshot = newSnapshot;
            for(var i = this.handlers.length - 1; i >= 0; i--)
              this.handlers[i](result);
          }
        });
      }
    });
  }

  /**
   * Registers a handler. If the wantsInitialValue is true, and there is a snapshot of the
   * collection available, then the handler will IMMEDIATELY recieve this snapshot presented
   * as a create update.
   * 
   * @param {Function} handler 
   * @param {Boolean} wantsInitialValue 
   */
	register(handler, wantsInitialValue) {
		if (wantsInitialValue && this.lastSnapshot != null) {
			handler({ oldSnapshot: null, newSnapshot: this.lastSnapshot, changeType: "create" });
    }

		this.handlers.push(handler);
	}
}

module.exports = CollectionStream;
