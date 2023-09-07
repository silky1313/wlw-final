const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mqttclient = require('../router/mqtt');
const log4js = require('../mylog4js.js').getLogger('stuRoutes');
const iconv = require('../utils/GB2023');
const path = require('path');
const ejs = require('ejs');

const collections = {
  Bike: Bike,
  Hbike: Hbike
};

exports.getData = catchAsync(async (req, res, next) => {
  const collection = req.query.msg;
  const Model = collections[collection];
  let result;

  if (!req.query.msg || !Model) {
    return new AppError('please tell me which form you need', 404);
  }
  result = await Model.find();
  console.log(req.query);
  res.status(200).json({
    code: 200,
    msg: 'success',
    length: result.length,
    result
  });
});

exports.updateData = catchAsync(async (req, res, next) => {
  let result = await Bike.updateOne({ id: '2001' }, req.query, {
    new: true
  });

  // if (req.query.r) {
  //   req.query.r = iconv.convertToGB2312(req.query.r);
  // }
  let cont = {
    status: 'ok',
    data: [req.query]
  };

  result = await Bike.find({ id: '2001' });
  mqttclient.publish('cont', cont);
  console.log(req.query);
  res.status(200).json({
    code: 200,
    msg: 'success',
    result
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Hbike.deleteMany();

  res.status(200).json({
    code: 204,
    msg: 'success'
  });
});
