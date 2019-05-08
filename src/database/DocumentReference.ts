import CollectionReference from "./CollectionReference";

class DocumentReference {
  public id: string;

  public collection: CollectionReference;

  constructor(id: string, collection: CollectionReference) {
    this.id = id;
    this.collection = collection;
  }

  get hash() {
    return new Buffer(
      `${this.collection.database.name}/${this.collection.database.name}/${
        this.collection.name
      }/${this.id}`
    ).toString("base64");
  }
}

export default DocumentReference;
