import { CollectionQuery } from "../database/DatabaseTypes";

export type SerializedRef = {
  type: string;
};

export type SerializedAppRef = SerializedRef & {
  name: string;
};

export type SerializedDatabaseRef = SerializedRef & {
  name: string;
  app: SerializedAppRef;
};

export type SerializedJoin = {
  field: string;
  collectionRef: SerializedCollectionRef;
};

export type SerializedCollectionRef = SerializedRef & {
  name: string;
  query: CollectionQuery;
  database: SerializedDatabaseRef;
  joins: SerializedJoin[];
};

export type SerializedDocumentRef = SerializedRef & {
  id: string;
  collection: SerializedCollectionRef;
  joins: SerializedJoin[];
};
