const moment = require('moment');
const Mqtt = require('../utils/mqtt.js');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync');
const log4js = require('../mylog4js.js').getLogger('mqtt');
const iconv = require('../utils/GB2023');

let mqttclient = new Mqtt({
  url: 'mqtt://localhost:1883',
  theme: [`shdsaveok`, `show`, `cont`],
  handleData: (message, topic) => {
    if (message) {
      let res;
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

function testConnWare() {
  const msg = {
    status: 'ok'
  };
  mqttclient.publish('cont', msg);
}
setInterval(testConnWare, 3000);

const save = catchAsync(async data => {
  const HHMMSS = moment()
    .format('HHmmss')
    .toString();
  const YYMMDD = moment()
    .format('YYYY-MM-DD')
    .toString();
  const id = '2001';
  const oldBike = await Bike.findOne({ id: id });
  data.date = YYMMDD + 'T' + data.date;
  data.id = id;
  // if (!oldBike) {
  //   await Bike.create(data);
  //   return;
  // }
  //1) 断电后同步数据 test ok
  console.log(data);
  if (data.n === '1') {
    const contMessage = {
      status: 'ok',
      data: [
        {
          date: HHMMSS
          // dl: oldBike.dl,
          // dr: oldBike.dr,
          // ll: oldBike.ll,
          // lr: oldBike.lr,
          // tl: oldBike.tl,
          // tr: oldBike.tr,
          // s: oldBike.s,
          // h: oldBike.h
        }
      ]
    };
    mqttclient.publish('cont', contMessage);
    return;
  }

  //3)TODO:保存历史数据
  await Hbike.create(data);

  //4)TODO:更新Bike
  if (oldBike.date < data.date) {
    await Bike.updateOne({ id: id }, data);
    console.log('更新成功');
  } else {
    console.log('更新失败: ');
    console.log(data);
  }
});

module.exports = mqttclient;
