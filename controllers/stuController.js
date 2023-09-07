const Bike = require('../models/bikeModel');
const Hbike = require('../models/HbikeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mqttclient = require('../router/mqtt');
const log4js = require('../mylog4js.js').getLogger('stuRoutes');

exports.getData = catchAsync(async (req, res, next) => {
  if (!req.query.msg) {
    return new AppError('please tell me which form you need', 404);
  }
  const collections = {
    Bike: Bike,
    Hbike: Hbike
  };

  const collection = req.query.msg;
  const Model = collections[collection];
  if (!Model) {
    return new AppError('invalid collection name', 400);
  }
  const result = await Model.find();

  log4js.debug(req.query.msg, result.length);
  res.status(200).json({
    code: 200,
    msg: 'success',
    result
  });
});

exports.updateData = catchAsync(async (req, res, next) => {
  let change = getSMinMax(req);
  let result = await Bike.updateOne({ id: '2001' }, change);
  let cont = {
    status: 'ok',
    data: [change]
  };

  result = await Bike.find({ id: '2001' });

  log4js.debug(cont);
  mqttclient.publish('cont', cont);
  res.status(200).json({
    code: 200,
    msg: 'success',
    result
  });
});

function getSMinMax(req) {
  let query = {};
  if (req.query.s) {
    query = {
      s: req.query.s
    };
  }
  if (req.query.min) {
    query = {
      ...query,
      min: req.query.min
    };
  }
  if (req.query.max) {
    query = {
      ...query,
      max: req.query.max
    };
  }
  return query;
}
