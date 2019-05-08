import DatabaseDeserializer from "../serialization/DatabaseDeserializer";
import DocumentReference from "./DocumentReference";
import { SerializedDocumentRef } from "../serialization/SerializationTypes";

class DocumentSnapshot {
  public ref: DocumentReference;

  public data: any;

  constructor(ref: DocumentReference, data: any) {
    this.ref = ref;
    this.data = data;
    if (this.data) delete this.data.id;
  }

  get id() {
    return this.ref.id;
  }
}

export default DocumentSnapshot;
