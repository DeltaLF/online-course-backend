const jwt = require("jsonwebtoken");

module.exports = (user) => {
  const exp = Math.floor(Date.now() / 1000) + 3 * 60 * 60;
  const jwtToken = jwt.sign(
    { userId: user._id, username: user.username, exp },
    process.env.JWT_SECRET
  );
  return jwtToken;
};
