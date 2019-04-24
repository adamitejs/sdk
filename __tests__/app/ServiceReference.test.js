const AppReference = require('../../app/AppReference');
const ServiceReference = require('../../app/ServiceReference');

describe('ServiceReference', () => {
  describe('constructor', () => {
    it('should construct a ServiceReference', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      expect(serviceRef.name).toBe('database');
      expect(serviceRef.app).toBe(appRef);
    });
  });

  describe('path', () => {
    it('should return the correct path', () => {
      const appRef = new AppReference('default');
      const serviceRef = new ServiceReference('database', appRef);
      expect(serviceRef.path).toBe('/default/database');
    });
  });
});