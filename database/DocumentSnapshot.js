class DocumentSnapshot {
  constructor(ref, data) {
    this.ref = ref;
    this.data = data;
  }

  static fromServerSnapshot(ref, snapshot) {
    return new DocumentSnapshot(
      ref,
      snapshot.data
    );
  }
}

module.exports = DocumentSnapshot;