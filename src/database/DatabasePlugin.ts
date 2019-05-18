import querystring from "querystring";
import client from "@adamite/relay-client";
import DatabaseReference from "./DatabaseReference";
import DocumentStream from "./DocumentStream";
import CollectionStream from "./CollectionStream";
import App from "../app/App";
import DocumentReference from "./DocumentReference";
import CollectionReference from "./CollectionReference";
import { AdamitePlugin } from "../app";

class DatabasePlugin implements AdamitePlugin {
  public app: App;

  public client: any;

  private documentStreamCache: any;

  private collectionStreamCache: any;

  constructor(app: App) {
    this.app = app;
    this.documentStreamCache = {};
    this.collectionStreamCache = {};
  }

  initialize(): void {
    this.client = client({
      service: "database",
      url: this.app.config.databaseUrl,
      apiKey: this.app.config.apiKey
    });

    this.client.on("connect", () => {
      this.app.log("database", "connected");
    });

    this.client.on("disconnect", (r: any) => {
      this.app.log("database", "disconnected");
      console.log(r);
    });

    this.client.on("error", (r: any) => {
      this.app.log("database", "error");
      console.log(r);
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

export default DatabasePlugin;
