import AppReference from "../../app/AppReference";

class AppSerializer {
  static serializeAppReference(appRef: AppReference) {
    return {
      type: "AppReference",
      name: appRef.name
    };
  }
}

export default AppSerializer;
