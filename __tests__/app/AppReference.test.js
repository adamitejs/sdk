const AppReference = require('../../app/AppReference');

describe('AppReference', () => {
  describe('constructor', () => {
    it('should save the name', () => {
      const appRef = new AppReference('test');
      expect(appRef.name).toBe('test');
    });
  });

  describe('path', () => {
    it('should return the correct path', () => {
      const appRef = new AppReference('default');
      expect(appRef.path).toBe('/default');
    });
  });

  describe('service', () => {
    it('should return a ServiceReference', () => {
      const appRef = new AppReference('default');
      const serviceRef = appRef.service('database');
      expect(serviceRef.name).toBe('database');
      expect(serviceRef.app).toBe(appRef);
    });
  });
});