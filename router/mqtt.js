const Mqtt = require('../utils/mqtt.js');
const express = require('express');
const Bike = require('../models/bikeModel');
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
      switch (topic) {
        case 'show1':
          save(res.data[0]);
          break;
        case 'show2':
          save(res.data[0]);
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
  const { _id, ...updateData } = data;
  if (!_id || !updateData) {
    return console.log('单车信息包发生缺失');
  }
  const query = { _id, date: { $lt: updateData.date } };
  const oldBike = await Bike.findByIdAndUpdate(query, updateData, {
    new: true,
    runValidators: true
  });

  if (oldBike) {
    console.log(`小车${_id}信息保存成功`);
  } else {
    console.log('单车信息过旧,小车信息保存失败');
  }
});

module.exports = router;
