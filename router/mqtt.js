const moment = require('moment');
const Mqtt = require('../utils/mqtt.js');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const catchAsync = require('../utils/catchAsync');

let flag = true;
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
      const success = 'ok';
      const standardTime = moment()
        .format('HHmmss')
        .toString();
      const message1 = {
        status: success,
        data: [{ date: standardTime }]
      };
      switch (topic) {
        case 'show':
          save(res.data[0]);
          if (flag) {
            mqttclient.publish('cont', message1);
            flag = false;
          }
          break;
        default:
          return;
      }
    }
  }
});
mqttclient.conn();

const save = catchAsync(async data => {
  const nowTime = moment()
    .format('YYYY-MM-DD')
    .toString();
  const id = '2001';

  data.date = nowTime + 'T' + data.date;
  data.id = id;
  //3) 保存历史数据
  const history = await Hbike.create(data);

  //4)更新Bike
  let oldBike = await Bike.findOne({ id: id });
  if (oldBike.date < data.date) {
    const newBike = await Bike.updateOne({ id: id }, data);
    if (newBike) {
      console.log(`${id}信息保存成功`);
    }
  } else {
    console.log('信息过旧,信息保存失败');
  }
});

module.exports = mqttclient;
