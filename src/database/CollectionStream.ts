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

  public lastSnapshot: DocumentSnapshot | undefined;

  public handlers: CollectionStreamCallback[];

  /**
   * Initialising a CollectionStream requires providing a DatabasePlugin from which
   * the CollectionStream will communicate to the database service. Further, it requires
   * a targetCollectionReference.
   *
   * @param {DatabasePlugin} databasePlugin
   * @param {CollectionReference} collectionReference
   */
  constructor(
    databasePlugin: DatabasePlugin,
    collectionReference: CollectionReference
  ) {
    this.databasePlugin = databasePlugin;
    this.collectionReference = collectionReference;
    this.handlers = [];
    this._subscribe();
  }

  /**
   * Registers a handler. If the wantsInitialValue is true, and there is a snapshot of the
   * collection available, then the handler will IMMEDIATELY recieve this snapshot presented
   * as a create update.
   *
   * @param {Function} handler
   * @param {Boolean} wantsInitialValue
   */
  register(handler: CollectionStreamCallback, wantsInitialValue: boolean) {
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

    const { subscription } = await client.invoke("subscribeCollection", {
      ref: DatabaseSerializer.serializeCollectionReference(
        this.collectionReference
      ),
      initialValues: true
    });

    client.socket.on(subscription.id, this._handleUpdate.bind(this));
  }

  _handleUpdate(update: StreamChanges) {
    const oldSnapshot =
      update.oldSnapshot &&
      new DocumentSnapshot(update.oldSnapshot.ref, update.oldSnapshot.data);
    const newSnapshot =
      update.newSnapshot &&
      new DocumentSnapshot(update.newSnapshot.ref, update.newSnapshot.data);
    const result = {
      changeType: update.changeType,
      newSnapshot,
      oldSnapshot
    };
    this.lastSnapshot = newSnapshot;
    this.handlers.forEach(handler => handler(result));
  }
}

export default CollectionStream;
