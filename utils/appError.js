class AppError extends Error {
  constructor(message, statusCode) {
    // 1)错误信息
    super(message);

    // 2）返回码一般都是500
    this.statusCode = statusCode;

    // 3）如果是5开头的就是服务器错误 4开头就是客户端错误
    this.status = `${statusCode}`.startsWith('4')
      ? 'error in client'
      : 'error in server';

    // 4) 判断是否是后端代码错误
    this.isOperational = true;

    // 5）保存错误的栈消息
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
