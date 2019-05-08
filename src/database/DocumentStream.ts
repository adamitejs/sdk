import DatabaseSerializer from "../serialization/DatabaseSerializer";
import DocumentSnapshot from "./DocumentSnapshot";
import DatabasePlugin from "./DatabasePlugin";
import DocumentReference from "./DocumentReference";
import { DocumentStreamCallback, StreamChanges } from "./DatabaseTypes";

/**
 * A DocumentStream is responsible for establishing a subscription to a document,
 * routing updates to that document to handlers, and providing handlers with the
 * most recent version of the document should they request it on connection.
 */
class DocumentStream {
  public databasePlugin: DatabasePlugin;

  public documentReference: DocumentReference;

  public lastSnapshot: DocumentSnapshot | undefined;

  public handlers: DocumentStreamCallback[];

  /**
   * Initialising a DocumentStream requires providing a DatabasePlugin from which
   * the DocumentStream will communicate to the database service. Further, it requires
   * a target DocumentReference.
   *
   * @param {DatabasePlugin} databasePlugin
   * @param {DocumentReference} documentReference
   */
  constructor(
    databasePlugin: DatabasePlugin,
    documentReference: DocumentReference
  ) {
    this.databasePlugin = databasePlugin;
    this.documentReference = documentReference;
    this.handlers = [];
    this._subscribe();
  }

  /**
   * Registers a handler. If the wantsInitialValue is true, and there is a snapshot of the
   * document available, then the handler will IMMEDIATELY recieve this snapshot presented
   * as a create update.
   *
   * @param {Function} handler
   * @param {Boolean} wantsInitialValue
   */
  register(handler: DocumentStreamCallback, wantsInitialValue: boolean) {
    if (wantsInitialValue && this.lastSnapshot != null) {
      handler({
        oldSnapshot: undefined,
        newSnapshot: this.lastSnapshot,
        changeType: "create"
      });
    }

    this.handlers.push(handler);
  }

  async _subscribe() {
    const client = this.databasePlugin.client;

    const { subscription } = await client.invoke("subscribeDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(
        this.documentReference
      ),
      initialValues: true
    });

    client.socket.on(subscription.id, this._handleUpdate.bind(this));
  }

  _handleUpdate(update: StreamChanges) {
    const newSnapshot =
      update.newSnapshot &&
      new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);
    const oldSnapshot =
      update.oldSnapshot &&
      new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);
    const result = {
      newSnapshot,
      oldSnapshot,
      changeType: update.changeType
    };
    this.lastSnapshot = newSnapshot;
    this.handlers.forEach(handler => handler(result));
  }
}

export default DocumentStream;
