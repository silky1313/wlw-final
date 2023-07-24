const sendError = (err, res) => {
  res.status(err.statusCode).json({
    code: err.statusCode,

    //1）错误信息
    message: err.message,

    //2）判断错误来自哪里
    status: err.status,

    //3）判断是否是代码错误
    isOperational: err.isOperational,

    //4）错误栈信息
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "I don't know where the error occurred";
  err.statusCode = err.statusCode || 500;
  sendError(err, res);
};
