const Test = require('../models/testModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.createTest = catchAsync(async (req, res, next) => {
  const newtest = await Test.create(req.body);
  res.status(200).json({
    newtest
  });
});

exports.getAllTests = catchAsync(async (req, res, next) => {
  const newtest = await Test.find();
  res.status(200).json({
    newtest
  });
});
