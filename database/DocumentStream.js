const DatabaseSerializer = require("../core/serialization/DatabaseSerializer");
const DocumentSnapshot = require("./DocumentSnapshot");

/**
 * A DocumentStream is responsible for establishing a subscription to a document,
 * routing updates to that document to handlers, and providing handlers with the
 * most recent version of the document should they request it on connection.
 */
class DocumentStream {
  /**
   * Initialising a DocumentStream requires providing a DatabasePlugin from which
   * the DocumentStream will communicate to the database service. Further, it requires
   * a target DocumentReference.
   *
   * @param {DatabasePlugin} databasePlugin
   * @param {DocumentReference} documentReference
   */
  constructor(databasePlugin, documentReference) {
    this.documentReference = documentReference;
    this.lastSnapshot = null;
    this.handlers = [];

    const client = databasePlugin.client;

    client.emit(
      "command",
      {
        name: "database.subscribeDocument",
        args: {
          ref: DatabaseSerializer.serializeDocumentReference(documentReference),
          initialValues: true
        }
      },
      response => {
        if (response.error) {
          return reject(response.error);
        } else {
          const {
            subscription: { id }
          } = response;

          client.on(id, update => {
            if (update.error) {
              return reject(response.error);
            } else {
              const newSnapshot =
                update.newSnapshot &&
                new DocumentSnapshot(
                  update.newSnapshot.ref,
                  update.newSnapshot.data
                );
              const oldSnapshot =
                update.oldSnapshot &&
                new DocumentSnapshot(
                  update.oldSnapshot.ref,
                  update.oldSnapshot.data
                );
              const result = {
                newSnapshot,
                oldSnapshot,
                changeType: update.changeType
              };
              this.lastSnapshot = newSnapshot;
              for (var i = this.handlers.length - 1; i >= 0; i--) {
                this.handlers[i](result);
              }
            }
          });
        }
      }
    );
  }

  /**
   * Registers a handler. If the wantsInitialValue is true, and there is a snapshot of the
   * document available, then the handler will IMMEDIATELY recieve this snapshot presented
   * as a create update.
   *
   * @param {Function} handler
   * @param {Boolean} wantsInitialValue
   */
  register(handler, wantsInitialValue) {
    if (wantsInitialValue && this.lastSnapshot != null) {
      handler({
        oldSnapshot: null,
        newSnapshot: this.lastSnapshot,
        changeType: "create"
      });
    }

    this.handlers.push(handler);
  }
}

module.exports = DocumentStream;
