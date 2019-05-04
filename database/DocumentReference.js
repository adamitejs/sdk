class DocumentReference {
  constructor(id, collection) {
    this.id = id;
    this.collection = collection;
    this.hash = this.collection + "/" + this.id;
  }
}

module.exports = DocumentReference;
