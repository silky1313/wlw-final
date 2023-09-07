const moment = require('moment');
const Mqtt = require('../utils/mqtt.js');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const catchAsync = require('../utils/catchAsync');
const log4js = require('../mylog4js.js').getLogger('mqtt');

let mqttclient = new Mqtt({
  url: 'mqtt://localhost:1883',
  theme: [`shdsaveok`, `show`, `cont`],
  handleData: (message, topic) => {
    if (message) {
      var res;
      try {
        res = JSON.parse(message);
      } catch (e) {
        return;
      } //非JSON数据不予处理
      if (res.data === undefined || res.data === null || res.data.length <= 0)
        return;

      switch (topic) {
        case 'show':
          save(res.data[0]);
          break;
        default:
          return;
      }
    }
  }
});
mqttclient.conn();

const save = catchAsync(async data => {
  const success = 'ok';
  const HHMMSS = moment()
    .format('HHmmss')
    .toString();
  const YYMMDD = moment()
    .format('YYYY-MM-DD')
    .toString();
  const id = '2001';
  data.date = YYMMDD + 'T' + data.date;
  data.id = id;

  //1) 保存历史数据
  let history = await Hbike.create(data);
  let oldBike = await Bike.findOne({ id: id });

  //2) 将修改发送给硬件
  if (data.n === '1') {
    const contMessage = {
      status: success,
      data: [
        {
          date: HHMMSS,
          min: oldBike.min,
          max: oldBike.max
        }
      ]
    };
    mqttclient.publish('cont', contMessage);
  }

  //3)更新Bike
  log4js.debug(data);
  if (oldBike.date < data.date) {
    const newBike = await Bike.updateOne({ id: id }, data);
    if (newBike) {
      log4js.debug(`${id}信息保存成功`);
    }
  } else {
    log4js.debug('信息过旧,信息保存失败');
  }
});

module.exports = mqttclient;
