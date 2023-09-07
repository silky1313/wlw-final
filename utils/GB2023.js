const iconv = require('iconv-lite');

exports.convertToGB2312 = function(str) {
  // 将字符串转换为 GB 2312 编码的字节数组
  const buffer = iconv.encode(str, 'gb2312');
  return Array.from(buffer).join('');
};
