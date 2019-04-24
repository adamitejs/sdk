const { App } = require('./app');

module.exports = function(name = 'default') {
  return App.getApp(name);
};