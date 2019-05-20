import DatabaseSerializer from "../serialization/DatabaseSerializer";
import DocumentSnapshot from "./DocumentSnapshot";
import DatabasePlugin from "./DatabasePlugin";
import CollectionReference from "./CollectionReference";
import CollectionSnapshot from "./CollectionSnapshot";
import { CollectionStreamCallback, StreamChanges } from "./DatabaseTypes";

/**
 * A CollectionSream is responsible for establishing a subscription to a collection,
 * routing updates to that collection to handlers, and providing handlers with the
 * most recent version of the collection should they request it on connection.
 */
class CollectionStream {
  public databasePlugin: DatabasePlugin;

  public collectionReference: CollectionReference;

  public handlers: CollectionStreamCallback[];

  private subscribed: boolean = false;

  private subscriptionId?: string;

  /**
   * Initialising a CollectionStream requires providing a DatabasePlugin from which
   * the CollectionStream will communicate to the database service. Further, it requires
   * a targetCollectionReference.
   *
   * @param {DatabasePlugin} databasePlugin
   * @param {CollectionReference} collectionReference
   */
  constructor(databasePlugin: DatabasePlugin, collectionReference: CollectionReference) {
    this.databasePlugin = databasePlugin;
    this.collectionReference = collectionReference;
    this.handlers = [];
  }

  /**
   * Registers a handler.
   *
   * @param {Function} handler
   */
  register(handler: CollectionStreamCallback) {
    this.handlers.push(handler);
    this.subscribe();
  }

  /**
   * Unregisters a handler.
   *
   * @param {Function} handler
   */
  unregister(handler: CollectionStreamCallback) {
    this.handlers = this.handlers.filter(h => h !== handler);
    if (this.handlers.length === 0) this.unsubscribe();
  }

  private async subscribe() {
    if (this.subscribed) return;

    const { subscription } = await this.databasePlugin.client.invoke("subscribeCollection", {
      ref: DatabaseSerializer.serializeCollectionReference(this.collectionReference)
    });

    this.databasePlugin.client.socket.on(subscription.id, this.handleUpdate.bind(this));

    this.subscriptionId = subscription.id;
    this.subscribed = true;
  }

  private async unsubscribe() {
    if (!this.subscribed) return;

    await this.databasePlugin.client.invoke("unsubscribe", {
      subscriptionId: this.subscriptionId
    });

    this.subscriptionId = undefined;
    this.subscribed = false;
  }

  private handleUpdate(update: StreamChanges) {
    const oldSnapshot = update.oldSnapshot && new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);
    const newSnapshot = update.newSnapshot && new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);

    this.handlers.forEach(handler =>
      handler({
        changeType: update.changeType,
        newSnapshot,
        oldSnapshot
      })
    );
  }
}

export default CollectionStream;
