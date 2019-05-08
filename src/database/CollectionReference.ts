import qs from "querystring";
import DocumentReference from "./DocumentReference";
import DatabaseReference from "./DatabaseReference";
import { CollectionQuery } from "./DatabaseTypes";

class CollectionReference {
  public name: string;

  public database: DatabaseReference;

  public query: CollectionQuery;

  constructor(name: string, database: DatabaseReference) {
    this.name = name;
    this.database = database;
    this.query = { limit: 1000, orderBy: [], where: [] };
  }

  get hash() {
    return new Buffer(
      `${this.database.app.name}/${this.database.name}/${
        this.name
      }?q=${encodeURIComponent(JSON.stringify(this.query))}`
    ).toString("base64");
  }

  doc(id: string) {
    return new DocumentReference(id, this);
  }

  limit(limit: number) {
    this.query.limit = limit;
    return this;
  }

  orderBy(field: string, direction: string = "asc") {
    this.query.orderBy.push([field, direction]);
    return this;
  }

  where(field: string, operator: string, value: string) {
    this.query.where.push([field, operator, value]);
    return this;
  }
}

export default CollectionReference;
