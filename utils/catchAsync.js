module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/*
  该实体类的主要作用是用来处理async/await错误
  避免过长的try catch
*/
