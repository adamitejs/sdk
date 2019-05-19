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

  public handlers: DocumentStreamCallback[];

  private subscribed: boolean = false;

  /**
   * Initialising a DocumentStream requires providing a DatabasePlugin from which
   * the DocumentStream will communicate to the database service. Further, it requires
   * a target DocumentReference.
   *
   * @param {DatabasePlugin} databasePlugin
   * @param {DocumentReference} documentReference
   */
  constructor(databasePlugin: DatabasePlugin, documentReference: DocumentReference) {
    this.databasePlugin = databasePlugin;
    this.documentReference = documentReference;
    this.handlers = [];
    this.subscribe();
  }

  /**
   * Registers a handler.
   *
   * @param {Function} handler
   */
  async register(handler: DocumentStreamCallback) {
    this.handlers.push(handler);
  }

  private async subscribe() {
    if (this.subscribed) return;

    const client = this.databasePlugin.client;

    const { subscription } = await client.invoke("subscribeDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(this.documentReference)
    });

    client.socket.on(subscription.id, this.handleUpdate.bind(this));

    this.subscribed = true;
  }

  private handleUpdate(update: StreamChanges) {
    const newSnapshot = update.newSnapshot && new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);
    const oldSnapshot = update.oldSnapshot && new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);

    this.handlers.forEach(handler =>
      handler({
        newSnapshot,
        oldSnapshot,
        changeType: update.changeType
      })
    );
  }
}

export default DocumentStream;
