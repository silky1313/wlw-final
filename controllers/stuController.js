const User = require('../models/userModel');
const Bike = require('../models/bikeModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return next(new AppError('Please provide username and password', 400));
  }
  const user = await User.findOne({
    password: { $eq: req.body.password },
    username: { $eq: req.body.username }
  });
  if (!user) {
    return next(new AppError('username or password is error', 404));
  }
  res.status(200).json({
    code: 200,
    msg: 'login is success'
  });
});

exports.getData = catchAsync(async (req, res, next) => {
  if (!req.query.msg) {
    return new AppError('please tell me which form you need', 404);
  }
  const collection = req.query.msg;
  let result;
  if (collection == 'User') {
    result = await User.find();
  } else if (collection === 'Bike') {
    result = await Bike.find();
  }
  res.status(200).json({
    code: 200,
    msg: 'success',
    result
  });
});

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(User.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const users = await features.query;

//   res.status(200);
//   res.message = 'get all user success';
//   res.data = [users];
//   success(res);
// });

// exports.getUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(new AppError('No user found with that ID', 404));
//   }

//   res.status(200);
//   res.message = success;
//   res.data = user;
//   success(res);
// });

// exports.createUser = catchAsync(async (req, res, next) => {
//   if (!req.body.username || !req.body.password) {
//     return next(new AppError('Please provide username and password', 400));
//   }
//   const user = await User.findOne({
//     username: { $eq: req.body.username }
//   });
//   if (user) {
//     return next(new AppError('username alerdy exit, please change it!', 404));
//   }
//   const newUser = await User.create(req.body);
//   res.status(201);
//   res.message = 'create user success';
//   res.data = [newUser];
//   success(res);
// });

// exports.updateUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!user) {
//     return next(new AppError('No user found with that ID', 404));
//   }

//   res.status(200);
//   res.message = success;
//   res.data = user;
//   success(res);
// });

// exports.deleteUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndDelete(req.params.id);

//   if (!user) {
//     return next(new AppError('No user found with that ID', 404));
//   }

//   //注意当状态码为204的时候没有返回值。
//   res.status(204);
//   res.message = success;
//   res.data = user;
//   success(res);
// });
