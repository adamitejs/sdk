import AppReference from "../../app/AppReference";

class AppDeserializer {
  static deserializeAppReference(appReference: AppReference) {
    return new AppReference(appReference.name);
  }
}

export default AppDeserializer;
