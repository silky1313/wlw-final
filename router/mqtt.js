const moment = require('moment');
const Mqtt = require('../utils/mqtt.js');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const User = require('../models/userModel.js');
const catchAsync = require('../utils/catchAsync');
const log4js = require('../mylog4js.js').getLogger('mqtt');
const iconv = require('../utils/GB2023');
const Update = require('../models/updateModel');

let latesTime = null;
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
      if (res.data === undefined || res.data === null || res.data.length <= 0) return;

      switch (topic) {
        case 'show':
          save(res.data[0]);
          //TODO:回消息
          testConnWare();
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
//setInterval(testConnWare, 3000);

/*
  if (!oldBike) {
    await Bike.create(data);
    return;
  }
 */
const save = catchAsync(async data => {
  const HHMMSS = moment()
    .format('HHmmss')
    .toString();
  const YYMMDD = moment()
    .format('YYYY-MM-DD')
    .toString();
  const id = '2001';
  const oldBike = await Bike.findOne({ id: id });

  if (data.date !== undefined) {
    data.date = YYMMDD + 'T' + data.date;
    latesTime = data.date;
  }
  data.id = id;

  //1) 断电后同步数据
  if (data.n === '1') {
    let contMessage = {
      status: 'ok',
      data: [
        {
          date: HHMMSS
        }
      ]
    };

    let result = await Update.find({}, { __v: 0, _id: 0 }).sort({ date: -1 });
    for (let i = 0; i < result.length; i++) {
      if (latesTime === null || latesTime < result[i].date) {
        let {
          _doc: { date, ...sonCont }
        } = result[i];
        contMessage.data[0] = { ...sonCont, ...contMessage.data[0] };
      }
    }
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
  }
});

module.exports = mqttclient;
