import AppReference from "../app/AppReference";
import CollectionReference from "./CollectionReference";

class DatabaseReference {
  public name: string;

  public app: AppReference;

  constructor(name: string, app: AppReference) {
    this.name = name;
    this.app = app;
  }

  collection(name: string) {
    return new CollectionReference(name, this);
  }
}

export default DatabaseReference;
