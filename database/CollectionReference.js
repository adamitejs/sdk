const DocumentReference = require('./DocumentReference');

class CollectionReference {
  constructor(name, database) {
    this.name = name;
    this.database = database;
    this._limit = 10000;
    this._orderBy = [];
    this._wheres = [];
  }

  doc(id) {
    return new DocumentReference(id, this);
  }

  limit(limit) {
    this._limit = limit;
    return this;
  }

  orderBy(field, direction = 'asc') {
    this._orderBy = [field, direction];
    return this;
  }

  where(field, operator, value) {
    this._wheres.push([field, operator, value]);
    return this;
  }
}

module.exports = CollectionReference;