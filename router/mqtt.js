const Mqtt = require('../utils/mqtt.js');
const express = require('express');
const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();

let mqttclient = new Mqtt({
  url: 'mqtt://localhost:1883',
  theme: [`shdsaveok`, `show1`, `show2`, `cont1`, `cont2`],
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
      const message1 = JSON.stringify({ status: 'ok' });
      switch (topic) {
        case 'show1':
          save(res.data[0]);
          mqttclient.publish('cont1', message1);
          break;
        case 'show2':
          save(res.data[0]);
          mqttclient.publish('cont2', message1);
          break;
        default:
          return;
      }
    }
  }
});
mqttclient.conn();

// 发布订阅消息函数
const publishMessage = () => {
  const message = JSON.stringify({ status: 'ok' });
  mqttclient.publish('cont1', message);
  mqttclient.publish('cont2', message);
  console.log(`已发布订阅消息: ${message}`);
};

// 每隔三秒发布订阅消息
//setInterval(publishMessage, 3000);

const save = catchAsync(async data => {
  //1) 现判断信息是否发生缺失
  const { _id, ...updateData } = data;
  if (!_id || Object.keys(updateData).length != 8) {
    return console.log('单车信息包发生缺失');
  }

  //2) 保存历史数据
  const history = await Hbike.create({ bike: data });
  if (!history) {
    console.log('历史数据保存失败');
  }

  //3)更新Bike collection
  const oldBike = await Bike.findById(_id);
  if (oldBike.date < updateData.date) {
    const newBike = await Bike.updateOne({ _id }, updateData);
    if (newBike) {
      console.log(`小车${_id}信息保存成功`);
    }
  } else {
    console.log('单车信息过旧,小车信息保存失败');
  }
});

module.exports = router;
