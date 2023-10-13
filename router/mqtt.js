const moment = require('moment');
const Mqtt = require('../utils/mqtt.js');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const catchAsync = require('../utils/catchAsync');
const log4js = require('../mylog4js.js').getLogger('mqtt');
const iconv = require('../utils/GB2023');
const Update = require('../models/updateModel');
const people = require('../models/people.js');
const light = require('../models/light');
const temp = require('../models/temp');
const amount = require('../models/amount.js');
const cl = require('../models/cl');
const cf = require('../models/cf');

let lastConnect = undefined;
async function sendMessage(w, msg) {
  await Bike.updateOne({ id: '2001' }, { w: w });
  //console.log(msg);
}

setInterval(async () => {
  //console.log(Date.now() - lastConnect < 3000);
  if (lastConnect === undefined || Date.now() - lastConnect >= 4000) {
    sendMessage('1', 'Hardware connect fail');
  } else if (Date.now() - lastConnect < 3000) {
    sendMessage('0', 'Hardware connect success');
  }
}, 1000);

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

//setInterval(testConnWare, 3000);

/*
  
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
  data.id = id;
  data.date = YYMMDD + 'T' + data.date;
  //0)TODO:对象不存在创建对象。
  if (!oldBike) {
    await Bike.create(data);
    return;
  }

  //1)TODO:断电后同步数据, 延迟更新
  if (data.n === '1') {
    let latesTime = oldBike.date;
    let result = await Update.find({}, { __v: 0, _id: 0 }).sort({ date: 1 });
    let i = 0;
    let contMessage = {
      status: 'ok',
      data: []
    };

    const interval = setInterval(() => {
      if (i >= result.length) {
        clearInterval(interval); // 当循环结束后，停止执行
        return;
      }

      if (latesTime === null || latesTime <= result[i].date) {
        let {
          _doc: { date, ...sonCont }
        } = result[i];
        contMessage.data[0] = { ...sonCont };
        console.log(contMessage);
        mqttclient.publish('cont', contMessage);
      }
      i++;
    }, 700);
    contMessage.data[0] = { date: HHMMSS };
    mqttclient.publish('cont', contMessage);
    return;
  }

  //3)TODO:保存历史数据
  await Hbike.create(data);
  if (data.p) {
    await people.create({ p: data.p, date: data.date });
  }
  if (data.t) {
    await temp.create({ t: data.t, date: data.date });
  }
  if (data.l) {
    await light.create({ l: data.l, date: data.date });
  }
  if (data.m) {
    await amount.create({ m: data.m, date: data.date });
  }
  if (data.cl) {
    await cl.create({ cl: data.cl, date: data.date });
  }
  if (data.cf) {
    await cf.create({ cf: data.cf, date: data.date });
  }

  //4)TODO:更新Bike h === 1历史数据不更新
  if (data.h === '1') {
    return;
  }
  if (oldBike.date < data.date) {
    await Bike.updateOne({ id: id }, data);
  } else {
    console.log(oldBike.date);
    console.log(data.date);
    console.log('更新失败');
  }

  //5)TODO:回复消息
  const msg = {
    status: 'ok'
  };
  mqttclient.publish('cont', msg);
});

module.exports = mqttclient;
