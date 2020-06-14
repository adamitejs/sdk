import DatabaseSerializer from "../serialization/DatabaseSerializer";
import DocumentSnapshot from "./DocumentSnapshot";
import DatabasePlugin from "./DatabasePlugin";
import DocumentReference from "./DocumentReference";
import { DocumentStreamCallback, StreamChanges } from "./DatabaseTypes";
import { EventEmitter } from "eventemitter3";

/**
 * A DocumentStream is responsible for establishing a subscription to a document,
 * routing updates to that document to handlers, and providing handlers with the
 * most recent version of the document should they request it on connection.
 */
class DocumentStream extends EventEmitter {
  public databasePlugin: DatabasePlugin;

  public documentReference: DocumentReference;

  public handlers: DocumentStreamCallback[];

  private subscribed: boolean = false;

  private subscriptionId?: string;

  /**
   * Initialising a DocumentStream requires providing a DatabasePlugin from which
   * the DocumentStream will communicate to the database service. Further, it requires
   * a target DocumentReference.
   *
   * @param {DatabasePlugin} databasePlugin
   * @param {DocumentReference} documentReference
   */
  constructor(databasePlugin: DatabasePlugin, documentReference: DocumentReference) {
    super();
    this.databasePlugin = databasePlugin;
    this.documentReference = documentReference;
    this.handlers = [];
  }

  /**
   * Registers a handler.
   *
   * @param {Function} handler
   */
  register(handler: DocumentStreamCallback) {
    this.handlers = [...this.handlers, handler];
    this.subscribe();
  }

  /**
   * Unregisters a handler.
   *
   * @param {Function} handler
   */
  unregister(handler: DocumentStreamCallback) {
    this.handlers = this.handlers.filter(h => h !== handler);
    if (this.handlers.length === 0) this.unsubscribe();
  }

  async subscribe() {
    if (this.subscribed) return;

    if (!this.databasePlugin.client) {
      throw new Error("The database plugin is not enabled on app instance: " + this.databasePlugin.app.ref.name);
    }

    this.subscribed = true;

    const { subscription } = await this.databasePlugin.client.invoke("subscribeDocument", {
      ref: DatabaseSerializer.serializeDocumentReference(this.documentReference)
    });

    this.databasePlugin.client.socket.on(subscription.id, this.handleUpdate.bind(this));

    this.subscriptionId = subscription.id;
    this.emit("subscribe");
  }

  async unsubscribe() {
    if (!this.subscribed) return;

    if (!this.databasePlugin.client) {
      throw new Error("The database plugin is not enabled on app instance: " + this.databasePlugin.app.ref.name);
    }

    this.databasePlugin.client.invoke("unsubscribe", {
      subscriptionId: this.subscriptionId
    });

    this.subscriptionId = undefined;
    this.subscribed = false;
    this.emit("unsubscribe");
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
