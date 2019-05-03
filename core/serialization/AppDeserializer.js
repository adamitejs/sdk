const AppReference = require("../../app/AppReference");

class AppDeserializer {
  static deserializeAppReference(appReference) {
    return new AppReference(appReference.name);
  }
}

module.exports = AppDeserializer;
