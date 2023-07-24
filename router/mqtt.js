const Mqtt = require('../utils/mqtt.js');
const express = require('express');
const Bike = require('../models/bikeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const router = express.Router();

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

// 发布订阅消息函数
const publishMessage = () => {
  const message = JSON.stringify({ status: 'ok' });
  mqttclient.publish('cont', message);
  console.log(`已发布订阅消息: ${message}`);
};

// 每隔三秒发布订阅消息
setInterval(publishMessage, 3000);

const save = catchAsync(async data => {
  const { _id, ...updateData } = data;
  console.log(_id);
  const newBike = await Bike.findByIdAndUpdate(_id, updateData, {
    new: true,
    runValidators: true
  });
  if (!newBike) {
    console.log(`小车${_id}信息保存失败`);
  } else {
    console.log(newBike);
    console.log(`小车${_id}信息保存成功`);
  }
});

module.exports = router;
