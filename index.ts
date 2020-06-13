import { App } from "./src/app";

const adamite = function(name = "default"): App {
  return App.getApp(name);
};

export { App, AppReference, AdamitePlugin } from "./src/app";

export { AuthPlugin, AuthAdmin } from "./src/auth";

export {
  DatabaseReference,
  CollectionReference,
  DocumentReference,
  CollectionSnapshot,
  CollectionStream,
  DocumentSnapshot,
  DocumentStream,
  DatabaseServerValue,
  DatabasePlugin,
  DatabaseAdmin
} from "./src/database";

export { FunctionsPlugin } from "./src/functions";

export { AppDeserializer, AppSerializer, DatabaseDeserializer, DatabaseSerializer } from "./src/serialization";

export default adamite;
