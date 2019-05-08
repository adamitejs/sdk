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

export type SerializedCollectionRef = SerializedRef & {
  name: string;
  query: CollectionQuery;
  database: SerializedDatabaseRef;
};

export type SerializedDocumentRef = SerializedRef & {
  id: string;
  collection: SerializedCollectionRef;
};
