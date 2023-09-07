var log4js = require('log4js');
log4js.configure({
  appenders: {
    stuRoutes: {
      type: 'file',
      filename: `${__dirname}/log/stuRoutes.log`
    },
    mqtt: {
      type: 'file',
      filename: `${__dirname}/log/mqtt.log`
    }
  },
  categories: {
    default: { appenders: ['stuRoutes'], level: 'debug' },
    stuRoutes: { appenders: ['stuRoutes'], level: 'debug' },
    mqtt: { appenders: ['mqtt'], level: 'debug' }
  }
});

module.exports = log4js;
