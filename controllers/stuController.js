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
const Sleep = require('../models/sleep');

const collections = {
  Bike: Bike,
  Hbike: Hbike,
  Update: Update,
  Sleep: Sleep
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
    result = await Model.find({}, { date1: 1, m: 1, t: 1 }).sort({ date: -1 });
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
  //console.log(req.query);
  // req.query.date = moment()
  //   .format('YYYY-MM-DDTHH:mm:ss')
  //   .toString();
  let result;
  if (req.query.date2) {
    result = await Bike.updateOne({ id: '2001' }, { date2: req.query.date2 });
    req.query.date = req.query.date2;
  } else if (req.query.rst || req.query.rh || req.query.nl || req.query.nr) {
    result = await Bike.updateOne({ id: '2001' }, req.query);
  }
  result = await Update.create(req.query);

  const { date2, ...msg } = req.query;
  let cont = {
    status: 'ok',
    data: [msg]
  };
  console.log(cont);
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
  await Sleep.deleteMany();

  res.status(200).json({
    code: 204,
    msg: 'success'
  });
});
