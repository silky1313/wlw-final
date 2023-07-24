const express = require('express');
//log middleware
const morgan = require('morgan');
//处理错误的控制器
const globalErrorHandler = require('./controllers/errorController');
//错误类
const AppError = require('./utils/appError');
//引进路由
const userRouter = require('./router/stuRoutes');
//连接mqtt服务器
const mqtt = require('./router/mqtt');
const querystring = require('querystring');
const app = express();

// 1) 配置生产环境和开发环境
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2）设置请求头
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  );
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 3)配置解析中间件
/*
  当客户端（例如浏览器、移动应用程序等）通过 HTTP POST 请求发送 JSON 数据时，
  express.json() 中间件会自动将 JSON 数据解析为 JavaScript 对象，
  并将其存储在 req.body 对象中，以便后续的处理程序使用。
*/
app.use(express.json());
/*
  app.use(express.urlencoded({ extended: false })); 是一个 Express 中间件，
  用于解析 URL-encoded 格式的请求体数据。并将其存储在req.body里面
  但是数据类型就不好说了
*/
app.use(express.urlencoded({ extended: false }));

// 4) 设置路由
app.use('/stu/v1', userRouter);

// 5) 连接mqtt服务器
//app.use('/mqtt', mqtt);

// 6) 对于所有未被处理的未找到路由的url输出404 not found
app.all('*', (req, res, next) => {
  next(new AppError('404 not found', 404));
});

// 7)全局错误处理中间件
app.use(globalErrorHandler);

module.exports = app;
