const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("validating user req:", req.headers);
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  console.log("here is token:", token);
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      console.log("is logged in:", decoded);
      console.log("locals :", req.locals);
      res.locals.user = decoded;
      next();
    } catch (err) {
      //req.decoded = decoded; // seems not necessary
      res
        .status(401)
        .send({
          success: false,
          message: "Invalid or Expired token, please log in first!",
        });
    }
  } else {
    return res
      .status(403)
      .send({
        success: false,
        message: "No token provided, please log in first!",
      });
  }
};
