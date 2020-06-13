import DatabaseReference from "./DatabaseReference";
import DocumentStream from "./DocumentStream";
import CollectionStream from "./CollectionStream";
import App from "../app/App";
import DocumentReference from "./DocumentReference";
import CollectionReference from "./CollectionReference";
import { AdamitePlugin } from "../app";

class DatabasePlugin extends AdamitePlugin {
  private documentStreamCache: { [key: string]: DocumentStream };
  private collectionStreamCache: { [key: string]: CollectionStream };

  constructor(app: App) {
    super(app);
    this.documentStreamCache = {};
    this.collectionStreamCache = {};
  }

  initialize(): void {
    super.initialize();

    this.client!.on("connect", () => {
      Object.values(this.documentStreamCache).forEach(stream => {
        stream.subscribe();
        stream.rehydrate();
      });
      Object.values(this.collectionStreamCache).forEach(stream => {
        stream.subscribe();
        stream.rehydrate();
      });
    });

    this.client!.on("error", () => {
      Object.values(this.documentStreamCache).forEach(stream => stream.unsubscribe());
      Object.values(this.collectionStreamCache).forEach(stream => stream.unsubscribe());
    });

    this.client!.on("disconnect", () => {
      Object.values(this.documentStreamCache).forEach(stream => stream.unsubscribe());
      Object.values(this.collectionStreamCache).forEach(stream => stream.unsubscribe());
    });
  }

  getPluginName(): string {
    return "database";
  }

  /**
   * Accepts a DocumentReference and returns a DocumentStream allowing for the
   * registration of handlers for updates of the corresponding DocumentSnapshot.
   *
   * @param {DocumentReference} documentReference
   */
  documentStream(documentReference: DocumentReference): DocumentStream {
    const hashKey = documentReference.hash;
    var hashValue = this.documentStreamCache[hashKey];

    if (hashValue == undefined) {
      hashValue = new DocumentStream(this, documentReference);
      this.documentStreamCache[hashKey] = hashValue;
      return hashValue;
    } else {
      return hashValue;
    }
  }

  /**
   * Accepts a CollectionReference and returns a CollectionStream allowing for
   * the registration of handlers for updates of the corresponding CollectionSnapshot.
   */
  collectionStream(collectionReference: CollectionReference): CollectionStream {
    const hashKey = collectionReference.hash;
    var hashValue = this.collectionStreamCache[hashKey];

    if (hashValue == undefined) {
      hashValue = new CollectionStream(this, collectionReference);
      this.collectionStreamCache[hashKey] = hashValue;
      return hashValue;
    } else {
      return hashValue;
    }
  }

  database(name = "default"): DatabaseReference {
    return new DatabaseReference(name, this.app.ref);
  }

  collection(name: string): CollectionReference {
    return this.database().collection(name);
  }
}

export default DatabasePlugin;
