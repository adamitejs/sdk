class AppSerializer {
  static serializeAppReference(appRef) {
    return {
      type: 'AppReference',
      name: appRef.name
    };
  }
}

module.exports = AppSerializer;