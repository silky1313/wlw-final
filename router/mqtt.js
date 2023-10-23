const moment = require('moment');
const Mqtt = require('../utils/mqtt.js');
const catchAsync = require('../utils/catchAsync');
const log4js = require('../mylog4js.js').getLogger('mqtt');
const iconv = require('../utils/GB2023');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const Update = require('../models/updateModel');
const Sleep = require('../models/sleep.js');

let lastConnect = undefined;
setInterval(async () => {
  //console.log(Date.now() - lastConnect < 3000);
  if (lastConnect === undefined || Date.now() - lastConnect >= 4000) {
    await Bike.updateOne({ id: '2001' }, { w: '1' });
  } else if (Date.now() - lastConnect < 3000) {
    await Bike.updateOne({ id: '2001' }, { w: '0' });
  }
}, 1500);

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
          lastConnect = Date.now();
          break;
        default:
          return;
      }
    }
  }
});
mqttclient.conn();

const save = catchAsync(async data => {
  const HHMMSS = moment()
    .format('HHmmss')
    .toString();
  const YYMMDD = moment()
    .format('YYYY-MM-DD')
    .toString();
  const id = '2001';
  const oldBike = await Bike.findOne({ id: id });
  data.id = id;
  data.date = YYMMDD + 'T' + data.date;
  //1)TODO:如果用户此时睡着了 || 发生火警报警
  if (data.sleep === '1') {
    await Sleep.create({ sleep: data.sleep, date: data.date });
  }

  //2)TODO:断电后同步数据, 延迟更新
  if (data.n === '1') {
    let latesTime = oldBike.date;
    let result = await Update.find({}, { __v: 0, _id: 0 }).sort({ date: 1 });
    let i = 0;
    let contMessage = {
      status: 'ok',
      data: []
    };

    // const interval = setInterval(() => {
    //   if (i >= result.length) {
    //     clearInterval(interval); // 当循环结束后，停止执行
    //     return;
    //   }

    //   if (latesTime === null || latesTime <= result[i].date) {
    //     let {
    //       _doc: { date, ...sonCont }
    //     } = result[i];
    //     contMessage.data[0] = { ...sonCont };
    //     console.log(contMessage);
    //     mqttclient.publish('cont', contMessage);
    //   }
    //   i++;
    // }, 700);
    contMessage.data[0] = { date: HHMMSS };
    mqttclient.publish('cont', contMessage);
    return;
  }

  //3)TODO:保存历史数据
  await Hbike.create(data);

  //4)TODO:更新Bike h === 1历史数据不更新
  if (data.h === '1') {
    return;
  }

  //5)TODO:更新数据库
  if (data.date !== undefined) {
    console.log(data);
    await Bike.updateOne({ id: id }, data);
  }

  //5)TODO:回复消息
  const msg = {
    status: 'ok'
  };
  mqttclient.publish('cont', msg);
});

module.exports = mqttclient;
