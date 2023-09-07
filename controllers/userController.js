const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');

exports.getAllUser = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.creatUser = factory.createOne(User);
exports.updatedUser = factory.updateOne(User);

exports.getSomeUser = catchAsync(async (req, res, next) => {
  let projection = { ...req.query };

  for (const key in projection) {
    projection[key] = parseInt(projection[key]);
  } 
  const users = await User.find({}, projection);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
