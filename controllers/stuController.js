const Bike = require('../models/bikeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mqttclient = require('../router/mqtt');
const log4js = require('../mylog4js.js').getLogger('stuRoutes');
const iconv = require('../utils/GB2023');
const path = require('path');
const ejs = require('ejs');
const moment = require('moment');
const Hbike = require('../models/HbikeModel');
const Update = require('../models/updateModel');
const people = require('../models/people.js');
const light = require('../models/light');
const temp = require('../models/temp');
const cl = require('../models/cl');
const cf = require('../models/cf');
const amount = require('../models/amount');

const collections = {
  Bike: Bike,
  Hbike: Hbike,
  Update: Update
};

/**
 * 限制只取一些字段可以
 * result = await Model.find({}, { date: 1 });
 * 这就是只取date
 */

exports.getData = catchAsync(async (req, res, next) => {
  const collection = req.query.msg;
  const Model = collections[collection];
  let result;

  if (!req.query.msg || !Model) {
    return new AppError('please tell me which form you need', 404);
  }

  if (Model === Hbike) {
    //查找历史数据建表
    result = await Model.find({}, { date: 1, p: 1, t: 1 }).sort({ date: -1 });
  } else {
    result = await Model.find();
  }
  res.status(200).json({
    code: 200,
    msg: 'success',
    length: result.length,
    result
  });
});

exports.updateData = catchAsync(async (req, res, next) => {
  req.query.date = moment()
    .format('YYYY-MM-DDTHH:mm:ss')
    .toString();
  if (req.query.dl) {
    req.query.dl += '00';
  }
  if (req.query.dr) {
    req.query.dr += '00';
  }
  let result = await Update.create(req.query);

  // if (req.query.r) {
  //   req.query.r = iconv.convertToGB2312(req.query.r);
  // }
  const { date, ...msg } = req.query;
  let cont = {
    status: 'ok',
    data: [msg]
  };
  console.log(msg);
  mqttclient.publish('cont', cont);

  res.status(200).json({
    code: 200,
    msg: 'success',
    result
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Hbike.deleteMany();
  await Update.deleteMany();
  await people.deleteMany();
  await light.deleteMany();
  await temp.deleteMany();
  await cl.deleteMany();
  await cf.deleteMany();
  await amount.deleteMany();

  console.log('delete success');
  res.status(200).json({
    code: 204,
    msg: 'success'
  });
});
