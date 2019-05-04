class DocumentReference {
  constructor(id, collection) {
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

module.exports = DocumentReference;
