module.exports = function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => {
      console.log("Async erorr is catched!!!!!!!!!!!!!!");
      next(e);
    });
  };
};
