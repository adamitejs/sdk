const DocumentReference = require('./DocumentReference');

class CollectionReference {
  constructor(name, database) {
    this.name = name;
    this.database = database;
    this.query = { limit: 1000, orderBy: [], where: [] };
  }

  doc(id) {
    return new DocumentReference(id, this);
  }

  limit(limit) {
    this.query.limit = limit;
    return this;
  }

  orderBy(field, direction = 'asc') {
    this.query.orderBy.push([field, direction]);
    return this;
  }

  where(field, operator, value) {
    this.query.where.push([field, operator, value]);
    return this;
  }
}

module.exports = CollectionReference;