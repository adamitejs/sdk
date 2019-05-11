import querystring from "querystring";
import { client } from "@adamite/relay";
import DatabaseReference from "./DatabaseReference";
import DocumentStream from "./DocumentStream";
import CollectionStream from "./CollectionStream";
import App from "../app/App";
import DocumentReference from "./DocumentReference";
import CollectionReference from "./CollectionReference";

class DatabasePlugin {
  public app: App;

  public client: any;

  public documentStreamCache: any;

  public collectionStreamCache: any;

  constructor(app: App) {
    this.app = app;
    (this.app as any).database = this.database.bind(this);

    // Intialisation of Caches.
    this.documentStreamCache = {};
    this.collectionStreamCache = {};

    this.client = client(app, {
      service: "database",
      url: this.app.config.databaseUrl
    });
  }

  /**
   * Accepts a DocumentReference and returns a DocumentStream allowing for the
   * registration of handlers for updates of the corresponding DocumentSnapshot.
   *
   * @param {DocumentReference} documentReference
   */
  documentStream(documentReference: DocumentReference) {
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
  collectionStream(collectionReference: CollectionReference) {
    const hashKey = collectionReference.name;
    var hashValue = this.collectionStreamCache[hashKey];

    if (hashValue == undefined) {
      hashValue = new CollectionStream(this, collectionReference);
      this.collectionStreamCache[hashKey] = hashValue;
      return hashValue;
    } else {
      return hashValue;
    }
  }

  get url() {
    const qs = querystring.stringify({
      key: this.app.config.apiKey,
      ...(this.app.config.queryString || {})
    });

    return `${this.app.config.databaseUrl}?${qs}`;
  }

  database(name = "default") {
    return new DatabaseReference(name, this.app.ref);
  }
}

(DatabasePlugin as any).PLUGIN_NAME = "database";
export default DatabasePlugin;
